<?php

namespace App\Command;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Validator\ConstraintViolation;
use Symfony\Contracts\HttpClient\HttpClientInterface;

/**
 * @exemple php bin/console app:add-user exemple@gmail.com 123456789 Vincent
 * @exemple php bin/console app:add-user exemple@gmail.com 123456789 Vincent --canAddFolder=true
 */
#[AsCommand(
    name: 'app:add-user',
    description: 'Add one user',
)]
class AddUserCommand extends Command
{
    public function __construct(
        private UserPasswordHasherInterface $passwordHasher,
        private EntityManagerInterface $entityManager,
        private ValidatorInterface $validator,
        private HttpClientInterface $httpClient
    )
    {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->addArgument('email', InputArgument::REQUIRED, 'Email')
            ->addArgument('password', InputArgument::REQUIRED, 'Password')
            ->addArgument('name', InputArgument::REQUIRED, 'Name')
            ->addOption('canAddFolder', null, InputOption::VALUE_OPTIONAL, 'Can add root folder for this user?')
            ->addOption('isAdmin', null, InputOption::VALUE_OPTIONAL, 'Is admin?')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $email = $input->getArgument('email');
        $password = $input->getArgument('password');
        $name = $input->getArgument('name');
        $canAddFolder = $input->getOption('canAddFolder');
        $isAdmin = $input->getOption('isAdmin');

        $user = new User();
        $hashedPassword = $this->passwordHasher->hashPassword(
            $user,
            $password
        );
        $user
            ->setEmail($email)
            ->setPassword($hashedPassword)
            ->setName($name)
            ->setRoles('true' === $isAdmin ? ['ROLE_USER', 'ROLE_ADMIN'] : ['ROLE_USER'])
        ;

        $errors = $this->validator->validate($user);
        if ($errors->count() > 0) {
            /** @var ConstraintViolation $error */
            foreach ($errors as $error) {
                $io->error($error->getMessage());
            }

            return Command::FAILURE;
        }

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        if ('true' === $canAddFolder) {
            $response = $this->httpClient->request(
                'POST',
                $_ENV['ZHEN_API_ENDPOINT'].'/s3files/folder',
                [
                    'headers' => [
                        'X-AUTH-API-KEY' => $_ENV['ZHEN_API_APIKEY'],
                    ],
                    'json' => [
                        'path' => $_ENV['APP_ENV']."/{$name}",
                        'bucket' => $_ENV['S3_BUCKET']
                    ]
                ]
            );

            if (Response::HTTP_CREATED === $response->getStatusCode()) {
                $io->info("Folder {$name} is created");
            } else {
                $io->error($response->getContent(false));
            }
        }

        $io->info('User is added');
        
        $io->success('AddUserCommand done.');

        return Command::SUCCESS;
    }
}

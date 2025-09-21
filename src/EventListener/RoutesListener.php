<?php

namespace App\EventListener;

use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\User\UserInterface;
use App\Entity\User;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

#[AsEventListener(event: KernelEvents::REQUEST, priority: -10)]
final class RoutesListener
{
    private Request $request;
    private ?UserInterface $user;

    public function __construct(
        private Security $security,
    ) {}

    public function __invoke(RequestEvent $event): void
    {
        if (!$event->isMainRequest()) {
            return;
        }

        if ($this->security->isGranted('ROLE_ADMIN')) {
            return;
        }

        $this->user = $this->security->getUser();
        $this->request = $event->getRequest();
        $route = $this->request->attributes->get('_route');

        if (str_starts_with($route, 'app_s3')) {
            $this->checkS3Routes();
        }
    }

    private function checkS3Routes(): void
    {
        $content = json_decode($this->request->getContent(), true);
        if (!isset($content['path'])) {
            return;
        }

        /** @var User $user */
        $user = $this->user;
        $pattern = "{$_ENV['APP_ENV']}\/{$user->getName()}";
        $result = preg_match("/^{$pattern}/", $content['path'], $matches);
        if (!$result) {
            throw new BadRequestHttpException('Erreur');
        }
    }
}
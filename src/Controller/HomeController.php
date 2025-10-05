<?php

namespace App\Controller;

use App\Entity\Contact;
use App\Entity\MessageEvent;
use App\Enum\MessageEventEnum;
use App\Form\ContactType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/zdrive')]
final class HomeController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager
    )
    {
    }

    #[Route('/accueil', name: 'app_home', methods:['GET'])]
    public function index(): Response
    {
        return $this->render('home/index.html.twig', [
            'controller_name' => 'HomeController',
        ]);
    }

    #[Route('/contact', name: 'app_contact', methods:['GET', 'POST'])]
    public function contact(Request $request): Response
    {
        $contact = new Contact();
        $form = $this->createForm(ContactType::class, $contact);
        $form->handleRequest($request);
        if ($form->isSubmitted()) {
            if ($form->isValid()) {
                $this->entityManager->persist($contact);
                $this->entityManager->flush();

                $event = new MessageEvent();
                $event
                    ->setEvent(MessageEventEnum::CONTACT)
                    ->setObjectId((string)$contact->getId())
                ;

                $this->entityManager->persist($event);
                $this->entityManager->flush();

                $this->addFlash('success', 'Message envoyé !');

                $contact = new Contact();
                $form = $this->createForm(ContactType::class, $contact);
            } else {
                $this->addFlash('danger', 'Il y a des erreurs !');
            }
        }

        return $this->render('home/contact.html.twig', [
            'form' => $form->createView(),
        ]);
    }
}

<?php

namespace App\Controller\API;

use App\Entity\MessageEvent;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Hhxsv5\SSE\SSE;
use Hhxsv5\SSE\Event;
use Hhxsv5\SSE\StopSSEException;
use Symfony\Component\HttpFoundation\StreamedResponse;

#[Route('/api/sse')]
final class SseController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager
    )
    {
    }

    #[Route('/event', name: 'app_sse_event')]
    public function index(): Response
    {
        $em = $this->entityManager;
        
        $response = new StreamedResponse();
        $response->headers->set('Content-Type', 'text/event-stream');
        $response->headers->set('Cache-Control', 'no-cache');
        $response->headers->set('Connection', 'keep-alive');
        $response->headers->set('X-Accel-Buffering', 'no'); // Nginx: unbuffered responses suitable for Comet and HTTP streaming applications
        $response->setCallback(function () use($em) {
            $callback = function () use($em) {
                set_time_limit(0);
                $shouldStop = false; // Stop if something happens or to clear connection, browser will retry
                if ($shouldStop) {
                    throw new StopSSEException();
                }
                
                $event = $em->getRepository(MessageEvent::class)->findOneBy([], ['createdAt' => 'desc']);
                if ($event instanceof MessageEvent) {
                    $payload = [
                        'type' => $event->getEvent()->value
                    ];

                    $em->remove($event);
                    $em->flush();

                    return json_encode($payload);
                }
            };
            (new SSE(new Event($callback, 'new_event')))->start(5);
        });

        return $response;
    }
}

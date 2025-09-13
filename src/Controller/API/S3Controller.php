<?php

namespace App\Controller\API;

use App\Services\S3Service;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/s3')]
final class S3Controller extends AbstractController
{
    public function __construct(
        private readonly S3Service $s3Service
    )
    { }

    #[Route('/get-folder', name: 'app_s3_get_folder', methods:['POST'])]
    public function index(Request $request): Response
    {
        $content = json_decode($request->getContent(), true);

        $response = $this->s3Service->getFolder($content['path']);

        return $this->json($response);
    }
}

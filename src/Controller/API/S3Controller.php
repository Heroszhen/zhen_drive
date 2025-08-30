<?php

namespace App\Controller\API;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/s3')]
final class S3Controller extends AbstractController
{
    #[Route('/get-folder', name: 'app_s3_get_folder', methods:['POST'])]
    public function index(Request $request): Response
    {
        return $this->json(null);
    }
}

<?php

namespace App\Services;

use Symfony\Contracts\HttpClient\HttpClientInterface;

class S3Service
{
    public function __construct(
        private readonly HttpClientInterface $s3Client
    )
    { }

    public function getFolder(string $path): array
    {
        $response = $this->s3Client->request('POST', '/api/s3files/list-folder', [
            'json' => ['bucket' => $_ENV['S3_BUCKET'], 'path' => $path]
        ]);
        
        $decodedResponse = json_decode($response->getContent(), true, 512, JSON_THROW_ON_ERROR);

        return $decodedResponse['hydra:member'] ?? [];
    }
}
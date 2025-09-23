<?php

namespace App\Services;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Component\Mime\Part\Multipart\FormDataPart;
use Symfony\Component\Mime\Part\DataPart;
use Symfony\Component\HttpFoundation\File\UploadedFile;

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

    public function addFolder(string $path): array
    {
        $response = $this->s3Client->request('POST', $_ENV['ZHEN_API_ENDPOINT'].'/s3files/folder', [
            'json' => ['bucket' => $_ENV['S3_BUCKET'], 'path' => $path]
        ]);
        $decodedResponse = json_decode($response->getContent(), true, 512, JSON_THROW_ON_ERROR);

        return $decodedResponse ?? [];
    }

    public function deleteDrive(string $path): bool
    {
        $response = $this->s3Client->request('POST', $_ENV['ZHEN_API_ENDPOINT'].'/s3files/delete', [
            'json' => ['bucket' => $_ENV['S3_BUCKET'], 'path' => $path]
        ]);

        return $response->getStatusCode() === Response::HTTP_NO_CONTENT;
    }

    public function sendFile(UploadedFile $file, string $path): array
    {
        $filePart = DataPart::fromPath(
            $file->getRealPath(),
            $file->getClientOriginalName(), 
            $file->getMimeType() ?? 'application/octet-stream'
        );

        $formParts = [
            'file' => $filePart,
            'bucket' => $_ENV['S3_BUCKET'],
            'path' => $path,
        ];

        $formData = new FormDataPart($formParts);
        $headers = array_merge(['Content-Type' => null], $formData->getPreparedHeaders()->toArray());

        $response = $this->s3Client->request('POST', $_ENV['ZHEN_API_ENDPOINT'].'/s3files/file', [
            'headers' => $headers,  
            'body' => $formData->bodyToIterable(),
        ]);
        $decodedResponse = json_decode($response->getContent(), true, 512, JSON_THROW_ON_ERROR);

        return $decodedResponse ?? [];
    }

    public function getBucket(string $path): array
    {
        $response = $this->s3Client->request('POST', $_ENV['ZHEN_API_ENDPOINT'].'/s3files/bucket', [
            'json' => ['bucket' => $_ENV['S3_BUCKET'], 'path' => $path]
        ]);
        $decodedResponse = json_decode($response->getContent(), true, 512, JSON_THROW_ON_ERROR);

        return $decodedResponse ?? [];
    }
}
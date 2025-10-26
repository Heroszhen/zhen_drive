<?php

namespace App\Services;

use App\Services\UtilService;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Component\Mime\Part\Multipart\FormDataPart;
use Symfony\Component\Mime\Part\DataPart;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class S3Service
{
    public function __construct(
        private readonly HttpClientInterface $s3Client,
        private readonly UtilService $utilService
    )
    { }

    public function getFolder(string $path): array
    {
        try {
            $response = $this->s3Client->request('POST', '/api/s3files/list-folder', [
                'json' => ['bucket' => $_ENV['S3_BUCKET'], 'path' => $path]
            ]);

            return json_decode($response->getContent(), true, 512, JSON_THROW_ON_ERROR);
        } catch (\Exception $e) {
            $this->utilService->logHttpErrorMessage($e);
        }
    }

    public function addFolder(string $path): array
    {
        try {
            $response = $this->s3Client->request('POST', $_ENV['ZHEN_API_ENDPOINT'].'/s3files/folder', [
                'json' => ['bucket' => $_ENV['S3_BUCKET'], 'path' => $path]
            ]);

            return json_decode($response->getContent(), true, 512, JSON_THROW_ON_ERROR);
        } catch (\Exception $e) {
            $this->utilService->logHttpErrorMessage($e);
        }
    }

    public function deleteDrive(string $path): bool
    {
        try {
            $response = $this->s3Client->request('POST', $_ENV['ZHEN_API_ENDPOINT'].'/s3files/delete', [
                'json' => ['bucket' => $_ENV['S3_BUCKET'], 'path' => $path]
            ]);

            return $response->getStatusCode() === Response::HTTP_NO_CONTENT;
        } catch (\Exception $e) {
            $this->utilService->logHttpErrorMessage($e);
        }
    }

    public function sendFile(UploadedFile $file, string $path): array
    {
        try {
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
            
            return json_decode($response->getContent(), true, 512, JSON_THROW_ON_ERROR);
        } catch (\Exception $e) {
            $this->utilService->logHttpErrorMessage($e);
        }
    }

    public function getBucket(string $path): array
    {
        try {
            $response = $this->s3Client->request('POST', $_ENV['ZHEN_API_ENDPOINT'].'/s3files/bucket', [
                'json' => ['bucket' => $_ENV['S3_BUCKET'], 'path' => $path]
            ]);

            return json_decode($response->getContent(), true, 512, JSON_THROW_ON_ERROR);
        } catch (\Exception $e) {
            $this->utilService->logHttpErrorMessage($e);
        }
    }

    public function getFileUrl(string $path): array
    {
        try {
            $response = $this->s3Client->request('POST', $_ENV['ZHEN_API_ENDPOINT'].'/s3files/file-url', [
                'json' => ['bucket' => $_ENV['S3_BUCKET'], 'path' => $path]
            ]);

            return json_decode($response->getContent(), true, 512, JSON_THROW_ON_ERROR);

        } catch (\Exception $e) {
            $this->utilService->logHttpErrorMessage($e);
        }
    }

    public function rename(string $oldPath, string $newPath, bool $isFile = true): array
    {
        $url = $_ENV['ZHEN_API_ENDPOINT'].'/s3files/rename-';
        $url .= $isFile ? 'file' : 'folder';

        try {
            $response = $this->s3Client->request('POST', $url, [
                'json' => ['bucket' => $_ENV['S3_BUCKET'], 'path' => $oldPath, 'newName' => $newPath]
            ]);

            return json_decode($response->getContent(), true, 512, JSON_THROW_ON_ERROR);

        } catch (\Exception $e) {
            $this->utilService->logHttpErrorMessage($e, 's3 rename');
        }
    }
}
<?php

namespace App\Services;

use Psr\Log\LoggerInterface;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class UtilService
{
    public function __construct(
        private readonly LoggerInterface $logger
    )
    {}

    public function logHttpErrorMessage(\Exception $e, string $title = 's3'): void
    {
        $this->logger->error("{$title}: {$e->getMessage()}");
        throw new BadRequestHttpException($e->getMessage());
    }
}
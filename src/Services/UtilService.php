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

    public function logHttpErrorMessage(\Exception $e): void
    {
        $this->logger->error("getFolder: {$e->getMessage()}");
        throw new BadRequestHttpException($e->getMessage());
    }
}
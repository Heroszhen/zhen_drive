<?php

namespace App\Model;

class S3File
{
    public function __construct(
        public ?string $name = null,
        public ?string $fullName = null,
        public ?string $extension = null,
        public ?int $size = null,
        public \DateTime $updated = new \DateTime()
    )
    { }
}
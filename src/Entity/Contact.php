<?php

namespace App\Entity;

use App\Repository\ContactRepository;
use App\Traits\TimestampableTrait;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: ContactRepository::class)]
class Contact
{
    use TimestampableTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Assert\NotBlank(message: 'Le champ est obligatoire')]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $target = null;

    #[Assert\NotBlank(message: 'Le champ est obligatoire')]
    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $message = null;

    #[Assert\NotBlank(message: 'Le champ est obligatoire')]
    #[ORM\Column(length: 255, nullable: true)]
    private ?string $name = null;

    #[Assert\NotBlank(message: 'Le champ est obligatoire')]
    #[ORM\Column(length: 10, nullable: true)]
    private ?string $civility = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTarget(): ?string
    {
        return $this->target;
    }

    public function setTarget(?string $target): static
    {
        $this->target = $target;

        return $this;
    }

    public function getMessage(): ?string
    {
        return $this->message;
    }

    public function setMessage(?string $message): static
    {
        $this->message = $message;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getCivility(): ?string
    {
        return $this->civility;
    }

    public function setCivility(?string $civility): static
    {
        $this->civility = $civility;

        return $this;
    }
}

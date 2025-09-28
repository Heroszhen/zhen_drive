<?php

namespace App\Entity;

use App\Enum\MessageEventEnum;
use App\Repository\MessageEventRepository;
use App\Traits\TimestampableTrait;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\IdGenerator\UuidGenerator;

#[ORM\Entity(repositoryClass: MessageEventRepository::class)]
class MessageEvent
{
    use TimestampableTrait;

    #[ORM\Id]
    #[ORM\Column(type: 'string', unique: true)]
    #[ORM\GeneratedValue(strategy: 'CUSTOM')]
    #[ORM\CustomIdGenerator(class: UuidGenerator::class)]
    private ?string $id = null;

    #[ORM\Column(type: 'string', enumType: MessageEventEnum::class, nullable: true)]
    private ?MessageEventEnum $event = null;

    #[ORM\Column(length: 50, nullable: true)]
    private ?string $objectId = null;

    public function getId(): ?string
    {
        return $this->id;
    }

    public function getEvent(): ?MessageEventEnum
    {
        return $this->event;
    }

    public function setEvent(MessageEventEnum $event): static
    {
        $this->event = $event;

        return $this;
    }

    public function getObjectId(): ?string
    {
        return $this->objectId;
    }

    public function setObjectId(?string $objectId): static
    {
        $this->objectId = $objectId;

        return $this;
    }
}

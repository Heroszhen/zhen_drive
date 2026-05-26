#! /bin/bash

npm run clean:code

winpty php vendor/bin/grumphp run --tasks=phpparser
vendor/bin/phpstan analyse
vendor/bin/php-cs-fixer fix
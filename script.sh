#!/usr/bin/env bash

docker compose exec api bash -c "
  php bin/console lexik:jwt:generate-keypair --overwrite -q &&
  php bin/console doctrine:database:create --if-not-exists &&
  php bin/console doctrine:schema:update --force &&
  php bin/console doctrine:fixtures:load -q
"
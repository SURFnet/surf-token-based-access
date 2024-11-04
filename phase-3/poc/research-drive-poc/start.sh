#!/bin/bash
set -e
export EFSS=research-drive-poc.pondersource.net
function waitForPort {
  x=$(docker exec -it $1 ss -tulpn | grep $2 | wc -l)
  until [ $x -ne 0 ]
  do
    echo Waiting for $1 to open port $2, this usually takes about 10 seconds ... $x
    sleep 1
    x=$(docker exec -it $1 ss -tulpn | grep $2 | wc -l)
  done
  echo $1 port $2 is open
}

docker run -d --network=testnet -e MARIADB_ROOT_PASSWORD=eilohtho9oTahsuongeeTh7reedahPo1Ohwi3aek --name=maria1.docker mariadb --transaction-isolation=READ-COMMITTED --binlog-format=ROW --innodb-file-per-table=1 --skip-innodb-read-only-compressed
docker run -d --network=testnet -p 443:443 -v $REPO_ROOT/oc-sciencemesh:/var/www/html/apps/sciencemesh -v /root/surf-token-based-access/phase-3/poc/tokenbaseddav:/var/www/html/apps/tokenbaseddav -e HOST=$EFSS --name=oc1.docker pondersource/dev-stock-oc1-sciencemesh

docker container cp /root/fullchain.pem oc1.docker:/tls/oc1.crt
docker container cp /root/privkey.pem oc1.docker:/tls/oc1.key
docker restart oc1.docker

waitForPort maria1.docker 3306
waitForPort oc1.docker 443

docker exec -e DBHOST=maria1.docker -e USER=einstein -e PASS=relativity  -u www-data oc1.docker sh -c "head -1 /init.sh | sh"

docker exec -it oc1.docker sed -i "8 i\      1 => '$EFSS'," /var/www/html/config/config.php
docker exec -it -u www-data oc1.docker ./occ app:enable tokenbaseddav
echo Now you should be able to log in at https://$EFSS as einstein / relativity.
docker logs -f oc1.docker
#!/bin/bash
set -e

export EFSS=cloud.pondersource.com
export REVA=mesh.pondersource.com

echo Please edit this file and run the commands one-by-one so you can check if it all works
exit 0

apt install -y certbot docker.io
certbot certonly --standalone
git clone https://github.com/cs3org/ocm-test-suite
cd ocm-test-suite
docker network inspect testnet >/dev/null 2>&1 || docker network create testnet

export REPO_ROOT=`pwd`
[ ! -d "./scripts" ] && echo "Directory ./scripts DOES NOT exist inside $REPO_ROOT, are you running this from the repo root?" && exit 1

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

docker pull pondersource/dev-stock-oc1-sciencemesh
docker run -d --network=testnet -e MARIADB_ROOT_PASSWORD=eilohtho9oTahsuongeeTh7reedahPo1Ohwi3aek --name=maria1.docker mariadb --transaction-isolation=READ-COMMITTED --binlog-format=ROW --innodb-file-per-table=1 --skip-innodb-read-only-compressed
docker run -d --network=testnet -p 443:443 -v $REPO_ROOT/oc-sciencemesh:/var/www/html/apps/sciencemesh -v /root/surf-token-based-access/phase-3/poc/tokenbaseddav:/var/www/html/apps/tokenbaseddav -e HOST=$EFSS --name=oc1.docker pondersource/dev-stock-oc1-sciencemesh

# dereference symlinks to /etc/letsencrypt/archive/$EFSS/fullchain*.pem
# and /etc/letsencrypt/archive/$EFSS/privkey*.pem,
# then safely copy them into the container from a full fs path
cp /etc/letsencrypt/live/$EFSS/fullchain.pem /root/fullchain.pem
cp /etc/letsencrypt/live/$EFSS/privkey.pem /root/privkey.pem
docker container cp /root/fullchain.pem oc1.docker:/tls/oc1.crt
docker container cp /root/privkey.pem oc1.docker:/tls/oc1.key
docker restart oc1.docker

waitForPort maria1.docker 3306
waitForPort oc1.docker 443

docker exec -e DBHOST=maria1.docker -e USER=einstein -e PASS=relativity  -u www-data oc1.docker sh /init.sh
docker exec maria1.docker mariadb -u root -peilohtho9oTahsuongeeTh7reedahPo1Ohwi3aek efss -e "insert into oc_appconfig (appid, configkey, configvalue) values ('sciencemesh', 'iopUrl', 'https://$REVA/');"
docker exec maria1.docker mariadb -u root -peilohtho9oTahsuongeeTh7reedahPo1Ohwi3aek efss -e "insert into oc_appconfig (appid, configkey, configvalue) values ('sciencemesh', 'revaSharedSecret', 'shared-secret-1');"
docker exec maria1.docker mariadb -u root -peilohtho9oTahsuongeeTh7reedahPo1Ohwi3aek efss -e "insert into oc_appconfig (appid, configkey, configvalue) values ('sciencemesh', 'inviteManagerApikey', 'shared-secret-1');"

docker exec -it oc1.docker sed -i "12 i\      3 => '$EFSS'," /var/www/html/config/config.php
echo Now you should be able to log in at https://$EFSS as einstein / relativity.

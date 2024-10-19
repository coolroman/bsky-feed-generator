TARGET=$1

if [ -z "$TARGET" ];
then
  echo TARGET not given
  exit
fi

dir_path=$(dirname $(realpath $0))

pushd $dir_path/..

docker compose build $TARGET
docker compose push $TARGET

popd

ssh -i ~/.ssh/timeweb root@95.140.158.170 "cd /home/hdrc && docker compose up $TARGET -d --pull=always && docker image prune -f"

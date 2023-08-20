# these 2 vars used to locate js bins. they located at ./server, because it feels more "main"
export PROTOC_GEN_TWIRP_BIN="./server/node_modules/.bin/protoc-gen-twirp_ts"
export PROTOC_GEN_TS_BIN="./server/node_modules/.bin/protoc-gen-ts"

export OUT_DIR_SERVER="./server/generated"
export OUT_DIR_CLIENT="./client/generated"

protoc \
  -I ./protos \
  --plugin=protoc-gen-ts=$PROTOC_GEN_TS_BIN \
  --plugin=protoc-gen-twirp_ts=$PROTOC_GEN_TWIRP_BIN \
  --ts_opt=client_none \
  --ts_opt=generate_dependencies \
  --ts_out=$OUT_DIR_SERVER \
  --twirp_ts_out=$OUT_DIR_SERVER \
  ./protos/*.proto

protoc \
  -I ./protos \
  --plugin=protoc-gen-ts=$PROTOC_GEN_TS_BIN \
  --plugin=protoc-gen-twirp_ts=$PROTOC_GEN_TWIRP_BIN \
  --ts_opt=client_none \
  --ts_opt=generate_dependencies \
  --ts_out=$OUT_DIR_CLIENT \
  --twirp_ts_out=$OUT_DIR_CLIENT \
  ./protos/*.proto
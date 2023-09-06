# these 2 vars used to locate JS binaries. they are actually installed in the client dir with npm install, so i can not move them elsewhere
export PROTOC_GEN_TWIRP_BIN="./client/node_modules/.bin/protoc-gen-twirp_ts"
export PROTOC_GEN_TS_BIN="./client/node_modules/.bin/protoc-gen-ts"

export OUT_DIR_SERVER="./server"
export OUT_DIR_CLIENT="./client/src/generated"

# server side. plugin binaries are located in the PATH. see https://twitchtv.github.io/twirp/docs/install.html
protoc \
  -I ./protos \
  --twirp_out=$OUT_DIR_SERVER \
  --go_out=$OUT_DIR_SERVER \
  ./protos/*.proto

# client side
protoc \
  -I ./protos \
  --plugin=protoc-gen-ts=$PROTOC_GEN_TS_BIN \
  --plugin=protoc-gen-twirp_ts=$PROTOC_GEN_TWIRP_BIN \
  --ts_opt=client_none \
  --ts_opt=generate_dependencies \
  --ts_out=$OUT_DIR_CLIENT \
  --twirp_ts_out=$OUT_DIR_CLIENT \
  ./protos/*.proto
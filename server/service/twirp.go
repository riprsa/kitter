package service

import (
	"context"

	"github.com/hararudoka/kitter/pb"
	"github.com/twitchtv/twirp"

	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

type TwirpHandler struct {
	*zerolog.Logger
}

func NewCatter() pb.Catter {
	return &TwirpHandler{
		Logger: &log.Logger,
	}
}

func (s *TwirpHandler) Register(ctx context.Context, r *pb.RegisterCatRequest) (*pb.RegisterCatResponse, error) {
	return nil, twirp.NewError(twirp.Unimplemented, "")
}

func (s *TwirpHandler) Login(context.Context, *pb.LoginCatRequest) (*pb.LoginCatResponse, error) {
	return nil, twirp.NewError(twirp.Unimplemented, "")
}

func (s *TwirpHandler) GetCat(context.Context, *pb.GetCatRequest) (*pb.GetCatResponse, error) {
	return nil, twirp.NewError(twirp.Unimplemented, "")
}

func (s *TwirpHandler) CreateKitt(context.Context, *pb.CreateKittRequest) (*pb.CreateKittResponse, error) {
	return nil, twirp.NewError(twirp.Unimplemented, "")
}

func (s *TwirpHandler) GetKitt(context.Context, *pb.GetKittRequest) (*pb.GetKittResponse, error) {
	return nil, twirp.NewError(twirp.Unimplemented, "")
}

func (s *TwirpHandler) ListKitts(context.Context, *pb.ListKittsRequest) (*pb.ListKittsResponse, error) {
	return nil, twirp.NewError(twirp.Unimplemented, "")
}

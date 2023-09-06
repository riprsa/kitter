package service

import (
	"context"

	"github.com/hararudoka/kitter/pb"
	"github.com/twitchtv/twirp"

	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

type Service struct {
	*zerolog.Logger
}

func New() pb.Catter {
	return &Service{
		Logger: &log.Logger,
	}
}

func (s *Service) Register(ctx context.Context, r *pb.RegisterCatRequest) (*pb.RegisterCatResponse, error) {
	return nil, twirp.NewError(twirp.Unimplemented, "")
}

func (s *Service) Login(context.Context, *pb.LoginCatRequest) (*pb.LoginCatResponse, error) {
	return nil, twirp.NewError(twirp.Unimplemented, "")
}

func (s *Service) GetCat(context.Context, *pb.GetCatRequest) (*pb.GetCatResponse, error) {
	return nil, twirp.NewError(twirp.Unimplemented, "")
}

func (s *Service) CreateKitt(context.Context, *pb.CreateKittRequest) (*pb.CreateKittResponse, error) {
	return nil, twirp.NewError(twirp.Unimplemented, "")
}

func (s *Service) GetKitt(context.Context, *pb.GetKittRequest) (*pb.GetKittResponse, error) {
	return nil, twirp.NewError(twirp.Unimplemented, "")
}

func (s *Service) ListKitts(context.Context, *pb.ListKittsRequest) (*pb.ListKittsResponse, error) {
	return nil, twirp.NewError(twirp.Unimplemented, "")
}

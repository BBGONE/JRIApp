namespace RIAPP.DataService.Core
{
    public class OperationOutput<TUseCaseResponse, TResponse> : IResponsePresenter<TUseCaseResponse, TResponse>
        where TUseCaseResponse : TResponse
    {
        public TResponse Response
        {
            get;
            private set;
        }


        public OperationOutput()
        {

        }

        public void Handle(TUseCaseResponse response)
        {
            Response = response;
        }
    }
}

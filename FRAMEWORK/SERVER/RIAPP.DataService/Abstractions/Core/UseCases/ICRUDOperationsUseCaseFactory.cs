using RIAPP.DataService.Core.Types;
using System;
using System.Threading.Tasks;

namespace RIAPP.DataService.Core
{
    public delegate Task ChangeSetExecutor();
    public delegate Task AfterChangeSetExecuted();
    public delegate Task AfterChangeSetCommited(SubResultList subResults);

    public class CRUDServiceMethods
    {
        public CRUDServiceMethods(Func<Exception, string> onError,
        Action<RowInfo> trackChanges,
        ChangeSetExecutor executeChangeSet,
        AfterChangeSetExecuted afterChangeSetExecuted,
        AfterChangeSetCommited subResultsExecutor)
        {
            OnError = onError;
            TrackChanges = trackChanges;
            ExecuteChangeSet = executeChangeSet;
            AfterChangeSetExecuted = afterChangeSetExecuted;
            AfterChangeSetCommited = subResultsExecutor;
        }
        public Func<Exception, string> OnError { get; }
        public Action<RowInfo> TrackChanges { get; }
        public ChangeSetExecutor ExecuteChangeSet { get; }
        public AfterChangeSetExecuted AfterChangeSetExecuted { get; }
        public AfterChangeSetCommited AfterChangeSetCommited { get; }
    }


    public interface ICRUDOperationsUseCaseFactory
    {
        ICRUDOperationsUseCase Create(BaseDomainService service, CRUDServiceMethods serviceMethods);
    }

    public interface ICRUDOperationsUseCaseFactory<TService> : ICRUDOperationsUseCaseFactory
        where TService : BaseDomainService
    {
        ICRUDOperationsUseCase<TService> Create(TService service, CRUDServiceMethods serviceMethods);
    }

}

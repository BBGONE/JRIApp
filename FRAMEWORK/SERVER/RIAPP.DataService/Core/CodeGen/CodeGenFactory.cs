using RIAPP.DataService.Resources;
using System;
using System.Linq;

namespace RIAPP.DataService.Core.CodeGen
{
    public class CodeGenFactory<TService> : ICodeGenFactory<TService>
        where TService : BaseDomainService
    {
        private readonly ICodeGenConfig _codeGenConfig;

        public CodeGenFactory(IServiceProvider serviceProvider)
        {
            _codeGenConfig = (ICodeGenConfig)serviceProvider.GetService(typeof(ICodeGenConfig));
        }

        public ICodeGenProvider GetCodeGen(BaseDomainService dataService, string lang)
        {
            if (!IsCodeGenEnabled)
            {
                throw new InvalidOperationException(ErrorStrings.ERR_CODEGEN_DISABLED);
            }

            System.Collections.Generic.IEnumerable<ICodeGenProviderFactory<TService>> factories = dataService.ServiceContainer.GetServices<ICodeGenProviderFactory<TService>>();
            ICodeGenProviderFactory<TService> providerFactory = factories.Where(c => c.Lang == lang).FirstOrDefault();

            if (providerFactory == null)
            {
                throw new InvalidOperationException(string.Format(ErrorStrings.ERR_CODEGEN_NOT_IMPLEMENTED, lang));
            }

            return providerFactory.Create(dataService);
        }

        public bool IsCodeGenEnabled => _codeGenConfig != null && _codeGenConfig.IsCodeGenEnabled;
    }
}
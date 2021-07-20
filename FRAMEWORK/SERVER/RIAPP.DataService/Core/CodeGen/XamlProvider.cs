using RIAPP.DataService.Core.Metadata;

namespace RIAPP.DataService.Core.CodeGen
{

    public class XamlProvider<TService> : ICodeGenProvider<TService>
         where TService : BaseDomainService
    {
        public XamlProvider(IMetaDataProvider owner, string lang)
        {
            Owner = owner;
            Lang = lang;
        }


        public string Lang
        {
            get;
        }

        public IMetaDataProvider Owner { get; }

        public virtual string GenerateScript(string comment = null, bool isDraft = false)
        {
            DesignTimeMetadata metadata = Owner.GetDesignTimeMetadata(isDraft);
            return metadata.ToXML();
        }
    }

    public class XamlProviderFactory<TService> : ICodeGenProviderFactory<TService>
         where TService : BaseDomainService
    {
        public ICodeGenProvider Create(BaseDomainService owner)
        {
            return Create((TService)owner);
        }

        public ICodeGenProvider<TService> Create(TService owner)
        {
            return new XamlProvider<TService>(owner, Lang);
        }

        public string Lang => "xaml";
    }
}

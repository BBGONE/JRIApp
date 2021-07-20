using RIAPP.DataService.Core.Metadata;
using RIAPP.DataService.Utils;
using System;
using System.Collections.Generic;
using System.Linq;

namespace RIAPP.DataService.Core.CodeGen
{

    public class TypeScriptProvider<TService> : ICodeGenProvider<TService>
         where TService : BaseDomainService
    {
        private readonly Func<IEnumerable<Type>> _clientTypes;
        private readonly ISerializer _serializer;
        private readonly IDataHelper _dataHelper;
        private readonly IValueConverter _valueConverter;

        public TypeScriptProvider(
            IMetaDataProvider owner,
            ISerializer serializer,
            IDataHelper dataHelper,
            IValueConverter valueConverter,
            string lang,
            Func<IEnumerable<Type>> clientTypes)
        {
            Owner = owner ?? throw new ArgumentNullException(nameof(owner));
            _serializer = serializer ?? throw new ArgumentNullException(nameof(serializer));
            _dataHelper = dataHelper ?? throw new ArgumentNullException(nameof(dataHelper));
            _valueConverter = valueConverter ?? throw new ArgumentNullException(nameof(valueConverter));
            Lang = lang;
            _clientTypes = clientTypes ?? (() => Enumerable.Empty<Type>());
        }

        public string Lang
        {
            get;
        }

        public IMetaDataProvider Owner { get; }

        public virtual string GenerateScript(string comment = null, bool isDraft = false)
        {
            RunTimeMetadata metadata = Owner.GetMetadata();
            TypeScriptHelper helper = new TypeScriptHelper(_serializer, _dataHelper, _valueConverter, metadata, _clientTypes());
            return helper.CreateTypeScript(comment);
        }
    }

    public class TypeScriptProviderFactory<TService> : ICodeGenProviderFactory<TService>
         where TService : BaseDomainService
    {
        private readonly IServiceContainer<TService> _serviceContainer;
        private readonly Func<IEnumerable<Type>> _clientTypes;

        public TypeScriptProviderFactory(IServiceContainer<TService> serviceContainer, Func<IEnumerable<Type>> clientTypes = null)
        {
            _serviceContainer = serviceContainer ?? throw new ArgumentNullException(nameof(serviceContainer));
            _clientTypes = clientTypes;
        }

        public ICodeGenProvider Create(BaseDomainService owner)
        {
            return Create((TService)owner);
        }

        public ICodeGenProvider<TService> Create(TService owner)
        {
            return new TypeScriptProvider<TService>(owner,
                _serviceContainer.Serializer,
                _serviceContainer.GetDataHelper(),
                _serviceContainer.GetValueConverter(),
                Lang, _clientTypes);
        }

        public string Lang => "ts";
    }
}

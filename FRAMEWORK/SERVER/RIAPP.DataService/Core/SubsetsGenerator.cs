using RIAPP.DataService.Core.Exceptions;
using RIAPP.DataService.Core.Metadata;
using RIAPP.DataService.Core.Types;
using RIAPP.DataService.Utils;
using System;
using System.Collections.Generic;
using System.Linq;

namespace RIAPP.DataService.Core
{
    internal class SubsetsGenerator
    {
        private readonly IDataHelper _dataHelper;
        private readonly RunTimeMetadata _metadata;

        public SubsetsGenerator(RunTimeMetadata metadata, IDataHelper dataHelper)
        {
            _metadata = metadata ?? throw new ArgumentNullException(nameof(metadata));
            _dataHelper = dataHelper ?? throw new ArgumentNullException(nameof(dataHelper));
        }

        public SubsetList CreateSubsets(IEnumerable<SubResult> subResults)
        {
            SubsetList result = new SubsetList();
            if (subResults == null)
            {
                return result;
            }

            foreach (SubResult subResult in subResults)
            {
                DbSetInfo dbSetInfo = _metadata.DbSets[subResult.dbSetName];

                if (result.Any(r => r.dbSetName == subResult.dbSetName))
                {
                    throw new DomainServiceException(string.Format("The included sub results already have DbSet {0} entities", dbSetInfo.dbSetName));
                }

                RowGenerator rowGenerator = new RowGenerator(dbSetInfo, subResult.Result, _dataHelper);

                Subset current = new Subset
                {
                    dbSetName = dbSetInfo.dbSetName,
                    rows = rowGenerator.CreateDistinctRows(),
                    names = dbSetInfo.GetNames()
                };

                result.Add(current);
            }

            return result;
        }
    }
}
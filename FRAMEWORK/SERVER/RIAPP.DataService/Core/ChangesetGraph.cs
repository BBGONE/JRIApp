using RIAPP.DataService.Core.Exceptions;
using RIAPP.DataService.Core.Metadata;
using RIAPP.DataService.Core.Types;
using RIAPP.DataService.Resources;
using System;
using System.Collections.Generic;
using System.Linq;

namespace RIAPP.DataService.Core
{
    public class ParentChildNode
    {
        public ParentChildNode(RowInfo childRow)
        {
            ChildRow = childRow;
        }

        public RowInfo ChildRow { get; set; }

        public RowInfo ParentRow { get; set; }

        public Association Association { get; set; }
    }

    internal class ChangeSetGraph : IChangeSetGraph
    {
        private readonly LinkedList<RowInfo> _allList = new LinkedList<RowInfo>();
        private readonly LinkedList<RowInfo> _deleteList = new LinkedList<RowInfo>();
        private readonly LinkedList<RowInfo> _insertList = new LinkedList<RowInfo>();
        private readonly RunTimeMetadata _metadata;
        private readonly LinkedList<RowInfo> _updateList = new LinkedList<RowInfo>();
        private DbSet[] sortedDbSets;
        private readonly LinkedList<ParentChildNode> updateNodes = new LinkedList<ParentChildNode>();


        public ChangeSetGraph(ChangeSetRequest changeSet, RunTimeMetadata metadata)
        {
            this.ChangeSet = changeSet ?? throw new ArgumentNullException(nameof(changeSet));
            this._metadata = metadata ?? throw new ArgumentNullException(nameof(metadata));
        }

        public ChangeSetRequest ChangeSet { get; }

        public IEnumerable<RowInfo> InsertList => _insertList;

        public IEnumerable<RowInfo> UpdateList => _updateList;

        public IEnumerable<RowInfo> DeleteList => _deleteList;

        public IEnumerable<RowInfo> AllList => _allList;

        private void GetAllParentDbSets(HashSet<String> list, string dbSetName)
        {
            var parentDbNames = _metadata.Associations.Values.Where(a => a.childDbSetName == dbSetName)
                    .Select(x => x.parentDbSetName)
                    .ToArray();

            foreach (string name in parentDbNames)
            {
                if (!list.Contains(name))
                {
                    list.Add(name);
                    GetAllParentDbSets(list, name);
                }
            }
        }

        private int DbSetComparison(DbSet dbSet1, DbSet dbSet2)
        {
            var parentDbNames = new HashSet<String>();
            GetAllParentDbSets(parentDbNames, dbSet1.dbSetName);
            if (parentDbNames.Contains(dbSet2.dbSetName))
            {
                return 1;
            }

            parentDbNames.Clear();
            GetAllParentDbSets(parentDbNames, dbSet2.dbSetName);
            if (parentDbNames.Contains(dbSet1.dbSetName))
            {
                return -1;
            }

            return string.Compare(dbSet1.dbSetName, dbSet2.dbSetName);
        }

        private static string GetKey(RowInfo rowInfo)
        {
            return string.Format("{0}:{1}", rowInfo.GetDbSetInfo().dbSetName, rowInfo.clientKey);
        }

        private Dictionary<string, RowInfo> GetRowsMap()
        {
            var result = new Dictionary<string, RowInfo>();
            foreach (var dbSet in ChangeSet.dbSets)
            {
                var dbSetInfo = _metadata.DbSets[dbSet.dbSetName];
                if (dbSetInfo.GetEntityType() == null)
                {
                    throw new DomainServiceException(string.Format(ErrorStrings.ERR_DB_ENTITYTYPE_INVALID,
                        dbSetInfo.dbSetName));
                }

                foreach (var rowInfo in dbSet.rows)
                {
                    rowInfo.SetDbSetInfo(dbSetInfo);
                    result.Add(GetKey(rowInfo), rowInfo);
                }
            }
            return result;
        }

        public void Prepare()
        {
            var rowsMap = GetRowsMap();

            foreach (var trackAssoc in ChangeSet.trackAssocs)
            {
                var assoc = _metadata.Associations[trackAssoc.assocName];
                var pkey = string.Format("{0}:{1}", assoc.parentDbSetName, trackAssoc.parentKey);
                var ckey = string.Format("{0}:{1}", assoc.childDbSetName, trackAssoc.childKey);
                var parent = rowsMap[pkey];
                var child = rowsMap[ckey];
                var childNode = new ParentChildNode(child)
                {
                    Association = assoc,
                    ParentRow = parent
                };
                updateNodes.AddLast(childNode);
            }


            foreach (var dbSet in GetSortedDbSets())
            {
                foreach (var rowInfo in dbSet.rows)
                {
                    var dbSetInfo = rowInfo.GetDbSetInfo();
                    _allList.AddLast(rowInfo);
                    switch (rowInfo.changeType)
                    {
                        case ChangeType.Added:
                            _insertList.AddLast(rowInfo);
                            break;
                        case ChangeType.Updated:
                            _updateList.AddLast(rowInfo);
                            break;
                        case ChangeType.Deleted:
                            _deleteList.AddFirst(rowInfo);
                            break;
                        default:
                            throw new DomainServiceException(string.Format(ErrorStrings.ERR_REC_CHANGETYPE_INVALID,
                                dbSetInfo.GetEntityType().Name, rowInfo.changeType));
                    }
                }
            }
        }

        public DbSet[] GetSortedDbSets()
        {
            if (sortedDbSets == null)
            {
                var array = ChangeSet.dbSets.ToArray();
                Array.Sort(array, DbSetComparison);
                sortedDbSets = array;
            }
            return sortedDbSets;
        }

        public ParentChildNode[] GetChildren(RowInfo parent)
        {
            return updateNodes.Where(u => u.ParentRow == parent).ToArray();
        }

        public ParentChildNode[] GetParents(RowInfo child)
        {
            return updateNodes.Where(u => u.ChildRow == child).ToArray();
        }
    }
}
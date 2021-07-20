namespace System.Linq.Dynamic.Core.Parser
{
    internal interface IKeywordsHelper
    {
        bool TryGetValue(string name, out object type);
    }
}

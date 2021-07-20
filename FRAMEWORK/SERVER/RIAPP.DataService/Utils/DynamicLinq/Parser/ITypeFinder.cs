using JetBrains.Annotations;
using System.Linq.Expressions;

namespace System.Linq.Dynamic.Core.Parser
{
    internal interface ITypeFinder
    {
        Type FindTypeByName([NotNull] string name, [CanBeNull] ParameterExpression[] expressions, bool forceUseCustomTypeProvider);
    }
}

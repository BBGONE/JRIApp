using System;
using System.Threading;

namespace RIAPP.DataService.Utils
{
    public class CallContext<T> : IDisposable
        where T : class
    {
        private static readonly AsyncLocal<CallContext<T>> _asyncLocal = new AsyncLocal<CallContext<T>>();
        private static CallContext<T> _currentScope
        {
            get => _asyncLocal.Value;
            set => _asyncLocal.Value = value;
        }

        private readonly object SyncRoot = new object();
        private readonly CallContext<T> _outerScope;
        private readonly T _contextData;
        private bool _isDisposed;

        public static T CurrentContext
        {
            get
            {
                CallContext<T> cur = _currentScope;
                return cur?._contextData;
            }
        }

        public CallContext(T contextData)
        {
            _isDisposed = true;
            _outerScope = null;
            _contextData = contextData;
            _outerScope = _currentScope;
            _isDisposed = false;
            _currentScope = this;
        }

        ~CallContext()
        {
            Dispose(false);
        }


        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }


        #region private methods and properties

        private void CheckDisposed()
        {
            if (_isDisposed)
            {
                throw new ObjectDisposedException("CallContext");
            }
        }

        private void Dispose(bool disposing)
        {
            if (_isDisposed)
            {
                return;
            }

            if (disposing)
            {
                lock (SyncRoot)
                {
                    if (_isDisposed)
                    {
                        return;
                    }

                    CallContext<T> outerScope = _outerScope;
                    while (outerScope != null && outerScope._isDisposed)
                    {
                        outerScope = outerScope._outerScope;
                    }

                    try
                    {
                        _currentScope = outerScope;
                    }
                    finally
                    {
                        _isDisposed = true;
                        if (_contextData is IDisposable)
                        {
                            ((IDisposable)_contextData).Dispose();
                        }
                    }
                }
            }
            else
            {
                _isDisposed = true;
            }
        }

        #endregion
    }
}
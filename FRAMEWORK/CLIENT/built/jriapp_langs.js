define("jriapp_ru", ["require", "exports", "jriapp_shared/lang", "jriapp/bootstrapper"], function (require, exports, lang_1, bootstrapper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PAGER = {
        firstText: "<<",
        lastText: ">>",
        previousText: "<",
        nextText: ">",
        pageInfo: "Записи с <span class='ria-pager-info-num'>{0}</span> по <span class='ria-pager-info-num'>{1}</span> из <span class='ria-pager-info-num'>{2}</span>",
        firstPageTip: "на 1 страницу",
        prevPageTip: "назад на {0}",
        nextPageTip: "вперед на {0}",
        lastPageTip: "последняя страница",
        showingTip: "записи от {0} до {1} из {2}",
        showTip: "показать записи от {0} до {1} из {2}"
    };
    var VALIDATE = {
        errorInfo: "Ошибки:",
        errorField: "поле:"
    };
    var TEXT = {
        txtEdit: "Редактировать",
        txtAddNew: "Добавить",
        txtDelete: "Удалить",
        txtCancel: "Отмена",
        txtOk: "ОК",
        txtRefresh: "Обновить",
        txtAskDelete: "Вы уверены, что хотите удалить запись?",
        txtSubmitting: "Сохранение данных ...",
        txtSave: "Сохранить",
        txtClose: "Закрыть",
        txtField: "Поле"
    };
    var _STRS = { PAGER: PAGER, VALIDATE: VALIDATE, TEXT: TEXT };
    var _ERRS = {
        ERR_OBJ_ALREADY_REGISTERED: "Объект с именем: {0} уже зарегестрирован и не может быть перезаписан",
        ERR_OPTIONS_ALREADY_REGISTERED: "Опции с именем: {0} уже зарегестрированы и не могут быть перезаписаны",
        ERR_APP_NEED_JQUERY: "Проект зависит от JQuery и не может без него правильно работать",
        ERR_ASSERTION_FAILED: 'Утверждение "{0}" не сработало',
        ERR_BINDING_CONTENT_NOT_FOUND: "BindingContent не найден",
        ERR_DBSET_READONLY: "Набор данных: {0} только для чтения и не может редактироваться",
        ERR_DBSET_INVALID_FIELDNAME: "В наборе данных: {0} не существует поля с именем: {1}",
        ERR_FIELD_READONLY: "Поле только для чтения и не может быть отредактировано",
        ERR_FIELD_ISNOT_NULLABLE: "Поле не может быть пустым и должно быть заполнено",
        ERR_FIELD_WRONG_TYPE: "Значение {0} имеет неверный тип данных. Оно должно иметь тип данных: {1}",
        ERR_FIELD_MAXLEN: "Значение иммет длинну большую чем разрешено в программе: {0}",
        ERR_FIELD_DATATYPE: "Неизвестный тип данных: {0}",
        ERR_FIELD_REGEX: "Значение {0} не прошло проверку на правильность",
        ERR_FIELD_RANGE: "Значение {0} выходит за диапазон {1} разрешенных значений",
        ERR_EVENT_INVALID: "Неверное имя события: {0}",
        ERR_EVENT_INVALID_FUNC: "Неверная функция для события",
        ERR_MODULE_NOT_REGISTERED: "Модуль: {0} не зарегистрирован",
        ERR_MODULE_ALREDY_REGISTERED: "Модуль: {0} уже зарегистрирован",
        ERR_PROP_NAME_EMPTY: "Имя свойства объекта пусто",
        ERR_PROP_NAME_INVALID: 'Объект не имеет свойства с именем: "{0}"',
        ERR_GLOBAL_SINGLTON: "Объект Global должен быть в единственном экземпляре",
        ERR_TEMPLATE_ALREADY_REGISTERED: "Шаблон с именем: {0} уже зарегистрирован",
        ERR_TEMPLATE_NOTREGISTERED: "Шаблон с именем: {0} не зарегистрирован",
        ERR_TEMPLATE_GROUP_NOTREGISTERED: "Группа шаблонов: {0} не зарегистрирована",
        ERR_TEMPLATE_HAS_NO_ID: "Шаблон внутри тэга SCRIPT должен иметь аттрибут ID",
        ERR_OPTIONS_HAS_NO_ID: "Опции внутри тэга SCRIPT должны иметь аттрибут ID",
        ERR_CONVERTER_NOTREGISTERED: "Конвертор: {0} не зарегистрирован",
        ERR_OPTIONS_NOTREGISTERED: "Опции: {0} не зарегистрированы",
        ERR_JQUERY_DATEPICKER_NOTFOUND: "Приложение зависит от JQuery.UI.datepicker и не может без него правильно работать",
        ERR_PARAM_INVALID: "Параметр: {0} имеет неправильное значение: {1}",
        ERR_PARAM_INVALID_TYPE: "Параметр: {0} имеет неверный тип. Его тип должен быть {1}",
        ERR_KEY_IS_EMPTY: "Значение ключа не должно быть пустым",
        ERR_KEY_IS_NOTFOUND: "Нет сущности с ключом: {0}",
        ERR_ITEM_IS_ATTACHED: "Неверная операция, по причине: Сущность уже была прикреплена к набору данных",
        ERR_ITEM_IS_DETACHED: "Неверная операция, по причине: Сущность не прикреплена к набору данных",
        ERR_ITEM_IS_NOTFOUND: "Неверная операция, по причине: Сущность не найдена",
        ERR_ITEM_NAME_COLLISION: 'В наборе данных "{0}" имя поля: "{1}" уже существует в сущности и не может быть декларирована повторно',
        ERR_DICTKEY_IS_NOTFOUND: "Неверное имя ключа: {0} в словаре. Поле с таким именем не существует",
        ERR_DICTKEY_IS_EMPTY: "Ключевое свойство: {0} в словаре должно быть заполненным",
        ERR_CONV_INVALID_DATE: "Не могу перевести строку: {0} в значение для даты (времени)",
        ERR_CONV_INVALID_NUM: "Не могу перевести строку: {0} в значение для числа",
        ERR_QUERY_NAME_NOTFOUND: "Не могу найти запрос с именем: {0}",
        ERR_QUERY_BETWEEN: 'Оператор "BETWEEN" требует два значения',
        ERR_QUERY_OPERATOR_INVALID: "Неверный оператор {0} в запросе",
        ERR_OPER_REFRESH_INVALID: "Невозможно обновить сущность в текущем состоянии",
        ERR_CALC_FIELD_DEFINE: 'Поле: "{0}" имеет неверное описание: Вычисляемые поля могут зависеть только от полей сущности',
        ERR_CALC_FIELD_SELF_DEPEND: 'Поле: "{0}" имеет неверное описание: Вычисляемые поля не могут зависеть от самих себя',
        ERR_DOMAIN_CONTEXT_INITIALIZED: "DbContext уже был иннициализирован",
        ERR_DOMAIN_CONTEXT_NOT_INITIALIZED: "DbContext не был иннициализирован",
        ERR_SVC_METH_PARAM_INVALID: "Неверный значение {1} параметра {0} для вызова сервис-метода: {2}",
        ERR_DB_LOAD_NO_QUERY: "Параметр для запроса требует заполненного значения",
        ERR_DBSET_NAME_INVALID: "Неверное имя набора данных: {0}",
        ERR_APP_NAME_NOT_UNIQUE: "Имя приложения: {0} уже зарегистрировано",
        ERR_ELVIEW_NOT_REGISTERED: "Не могу найти element view: {0}",
        ERR_ELVIEW_NOT_CREATED: "Не могу создать element view для элемента с Тэгом: {0}",
        ERR_BIND_TARGET_EMPTY: "Binding target is empty",
        ERR_BIND_TGTPATH_INVALID: "Binding targetPath has invalid value: {0}",
        ERR_BIND_MODE_INVALID: "Binding mode has invalid value: {0}",
        ERR_BIND_TARGET_INVALID: "Binding target must be a descendant of BaseObject",
        ERR_EXPR_BRACES_INVALID: "Expression {0} has no closing braces",
        ERR_APP_SETUP_INVALID: "Application's setUp method parameter must be a valid function",
        ERR_GRID_DATASRC_INVALID: "DataGrid's datasource must be a descendant of Collection type",
        ERR_COLLECTION_CHANGETYPE_INVALID: "Invalid Collection change type value: {0}",
        ERR_GRID_COLTYPE_INVALID: "Invalid Column type type value: {0}",
        ERR_PAGER_DATASRC_INVALID: "Pager datasource must be a descendant of Collection type",
        ERR_STACKPNL_DATASRC_INVALID: "StackPanel datasource must be a descendant of Collection type",
        ERR_STACKPNL_TEMPLATE_INVALID: "StackPanel templateID is not provided in the options",
        ERR_LISTBOX_DATASRC_INVALID: "ListBox datasource must be a descendant of Collection type",
        ERR_DATAFRM_DCTX_INVALID: "DataForm's dataContext must be a descendant of BaseObject type",
        ERR_DCTX_HAS_NO_FIELDINFO: "DataContext has no getFieldInfo method",
        ERR_TEMPLATE_ID_INVALID: "Элемент с TemplateID: {0} не существует",
        ERR_ITEM_DELETED_BY_ANOTHER_USER: "Запись была удалена другим пользователем",
        ERR_ACCESS_DENIED: "Операция не разрешена. Попросите администратора дать Вам права для ее осуществления",
        ERR_CONCURRENCY: "Запись была изменена другим пользователем. Обновите запись перед ее редактированием.",
        ERR_VALIDATION: "Проверка на корректность не прошла успешно. Проверьте правильность введенных данных",
        ERR_SVC_VALIDATION: "Проверка на корректность: {0}",
        ERR_SVC_ERROR: "Ошибка сервера: {0}",
        ERR_UNEXPECTED_SVC_ERROR: "Неожиданная ошибка сервера: {0}",
        ERR_ASSOC_NAME_INVALID: "Invalid association name: {0}",
        ERR_DATAVIEW_DATASRC_INVALID: "TDataView datasource must not be null and should be descendant of Collection type",
        ERR_DATAVIEW_FILTER_INVALID: "TDataView fn_filter option must be valid function which accepts entity and returns boolean value"
    };
    lang_1.assign(lang_1.STRS, _STRS);
    lang_1.assign(lang_1.ERRS, _ERRS);
    bootstrapper_1.bootstrapper.addOnInitialize(function (boot) {
        var datepicker = boot.getSvc("IDatepicker");
        if (!datepicker) {
            throw new Error("IDatepicker service is not registered");
        }
        $.datepicker.regional["ru"] = {
            closeText: "Закрыть",
            prevText: "&#x3c;Пред",
            nextText: "След&#x3e;",
            currentText: "Сегодня",
            monthNames: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
                "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
            monthNamesShort: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн",
                "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
            dayNames: ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"],
            dayNamesShort: ["вск", "пнд", "втр", "срд", "чтв", "птн", "сбт"],
            dayNamesMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
            dateFormat: "dd.mm.yy",
            firstDay: 1,
            isRTL: false
        };
        datepicker.datepickerRegion = "ru";
    });
});

import {base} from './env';

export default {
    //Authentication
    LOGIN_USER: base + '/api/admin/login',
    // UPDATE_ADMIN_PROFILE: base + '/api/admin/profile/update',
    UPDATE_ADMIN_PASSWORD: base + '/api/admin/password/change',
    //Users
    USER_STORE: base + '/api/users/store',
    USER_UPDATE: base + '/api/users/update',
    USER_EDIT: base + '/api/users/edit',
    USER_DELETE: base + '/api/users/change-status',
    USER_ACCESS: base + '/api/users/block-status',
    USER_LOGOUT: base + '/api/sessions/logout',
    USER_IS_DELETE: base + '/api/users/change-status',
    ALL_USERS: base + '/api/users',
    CHANGE_USER_ROLE: base + '/api/users/update/role',
    //Categories
    STORE_CATEGORY: base + '/api/category/store',
    STORE_SUB_CATEGORY: base + '/api/category/store/sub-category',
    EDIT_CATEGORY: base + '/api/category/edit',
    UPDATE_CATEGORY: base + '/api/category/update',
    UPDATE_SUB_CATEGORY: base + '/api/category/update/sub-category',
    DELETE_CATEGORY: base + '/api/category/delete',
    ALL_CATEGORIES: base + '/api/category',
    ALL_SUB_CATEGORIES: base + '/api/category/sub-category',
    SINGLE_SUB_CATEGORIES: base + '/api/category/sub-category',
    SINGLE_SUB_CATEGORIES_OPEN: base + '/api/category/sub-category/all',
    ALL_CATEGORIES_OPEN: base + '/api/category/all',
    ALL_SUB_CATEGORIES_OPEN: base + '/api/category/sub-category/all',
    STORE_CATEGORY_TRANSLATIONS: base + '/api/admin/categories/translation/store',
    UPDATE_CATEGORY_TRANSLATIONS: base + '/api/admin/categories/translation/update',

    //PERMISSIONS
    STORE_PERMISSION: base + '/api/permission/store',
    EDIT_PERMISSION: base + '/api/permission/edit',
    UPDATE_PERMISSION: base + '/api/permission/update',
    DELETE_PERMISSION: base + '/api/permission/delete',
    ALL_PERMISSIONS: base + '/api/permission',

    //CITIES
    STORE_CITY: base + '/api/city/store',
    EDIT_CITY: base + '/api/city/edit',
    UPDATE_CITY: base + '/api/city/update',
    DELETE_CITY: base + '/api/city/delete',
    ALL_CITIES: base + '/api/city',
    ALL_CITIES_OPEN: base + '/api/city/all',

    //PROVINCES
    STORE_PROVINCE: base + '/api/province/store',
    EDIT_PROVINCE: base + '/api/province/edit',
    UPDATE_PROVINCE: base + '/api/province/update',
    DELETE_PROVINCE: base + '/api/province/delete',
    ALL_PROVINCES: base + '/api/province',
    ALL_PROVINCES_OPEN: base + '/api/province/all',

    //PROVINCES
    STORE_COUNTRY: base + '/api/country/store',
    EDIT_COUNTRY: base + '/api/country/edit',
    UPDATE_COUNTRY: base + '/api/country/update',
    DELETE_COUNTRY: base + '/api/country/delete',
    ALL_COUNTRIES: base + '/api/country',
    ALL_COUNTRIES_OPEN: base + '/api/country/all',

    //Supports
    ALL_SUPPORTS: base + '/api/support',
    DELETE_SUPPORT: base + '/api/support/delete',
    STORE_SUPPORT: base + '/api/support/store',
    CHANGE_STATUS: base + '/api/support/change-status',

    //Preference

    USER_PREFERENCE: base + '/api/user/preference/edit',
    USER_PREFERENCE_UPDATE: base + '/api/user/preference/update',

    //Sessions
    GET_HISTORY: base +'/api/sessions/edit',

    //Roles
    STORE_ROLE: base + '/api/role/store',
    EDIT_ROLE: base + '/api/role/edit',
    UPDATE_ROLE: base + '/api/role/update',
    DELETE_ROLE: base + '/api/role/delete',
    ALL_ROLES: base + '/api/role',
    ALL_USERS_ROLES: base + '/api/role/users',

    //Events
    STORE_EVENT: base + '/api/event/store',
    STORE_EVENT_VIDEO: base + '/api/event/video-upload',
    STORE_EVENT_LINKS: base + '/api/event/video-links',
    EDIT_EVENT: base + '/api/event/edit',
    EDIT_EVENT_VIDEO: base + '/api/event/edit/video',
    UPDATE_EVENT: base + '/api/event/update',
    DELETE_EVENT: base + '/api/event/delete',
    ALL_EVENTS: base + '/api/event',
    DELETE_EVENT_VIDEO: base+ '/api/event/video-delete',
    DELETE_EVENT_VIDEO_SINGLE: base + '/api/event/video-delete-single',
    DELETE_EVENT_IMAGE_SINGLE: base + '/api/event/image-delete-single',
    EVENT_CREATED_BY: base+'/api/event/created-by',


    GET_ALL_POSTS: base + '/api/post/all',
    GET_ALL_AUTHORS: base + '/api/author/all',
    GET_ALL_CATEGORIES: base + '/api/category/all',
    GET_ALL_TAGS: base + '/api/tag/all',
    GET_ALL_SEO_TAGS: base + '/api/seo-tag/all',
    GET_ALL_ROLES: base + '/api/role/all',


    //export csv

    EXPORT_CSV: base + '/api/event/exports-to-csv/monthly',

    //files
    FILE_STORE: base + '/api/file/store',
    GET_ALL_FILES: base + '/api/file/all',
    DELETE_FILE: base + '/api/file/delete',

    //deviceid

    GET_DEVICE_ID: base + '/api/device-id',
    CHANGE_STATUS_DEVICE_ID: base + '/api/device-id/change-status',
    DELETE_DEVICE_ID: base + '/api/device-id/delete'
}
const data = [

    {
    id: "dashboards",
    icon: "iconsminds-shop-4",
    label: "menu.dashboards",
    permissions: true,
    to: "/app/dashboard",
  },

    {
        id: 'categories',
        icon: "simple-icon-menu",
        label: "menu.categories",
        subPermissions: ['category','category.store','category.edit', 'category.update', 'category.delete'],
        to: "/app/categories",
        subs: [{
            icon: 'simple-icon-note',
            label: "menu.create",
            permissions: 'category.store',
            to: "/app/categories/create",
        }, {
            icon: 'iconsminds-preview',
            label: "menu.view",
            permissions: 'category',
            to: "/app/categories/view",
        }]
    },

    {
        id: 'sub-categories',
        icon: "simple-icon-list",
        label: "menu.categoriesSub",
        subPermissions: ['category','category.store','category.edit', 'category.update', 'category.delete'],
        to: "/app/sub-categories",
        subs: [{
            icon: 'simple-icon-note',
            label: "menu.create",
            permissions: 'category.store',
            to: "/app/sub-categories/create",
        }, {
            icon: 'iconsminds-preview',
            label: "menu.view",
            permissions: 'category',
            to: "/app/sub-categories/view",
        }]
    },

    {
        id: 'Users',
        icon: "simple-icon-user-follow",
        label: "menu.users",
        subPermissions: ['users','users.store','users.edit', 'users.update', 'users.delete'],
        to: "/app/users/view",
        subs: [
                {
                icon: 'simple-icon-note',
                label: "menu.create",
                permissions: 'users.store',
                to: "/app/users/create",
            },
            {
                icon: "iconsminds-preview",
                label: "menu.view",
                permissions: 'users',
                to: "/app/users/view"
            }]
    },

    // {
    //     id: 'Files',
    //     icon: "iconsminds-files",
    //     label: "Files",
    //     to: "/app/files/view",
    //     subPermissions: ['users'],
    // },

    {
        id: 'event',
        icon: "simple-icon-event",
        label: "menu.event",
        subPermissions: ['event','event.store', 'event.edit', 'event.update', 'event.delete'],
        to: "/app/event/view",
        subs: [
                {
                icon: 'simple-icon-note',
                label: "menu.create",
                permissions: 'event.store',
                to: "/app/event/create",
            },
            {
                icon: "iconsminds-preview",
                label: "menu.view",
                permissions: 'event',
                to: "/app/event/view"
            }]
    },

    {
        id: 'settings',
        icon: 'simple-icon-settings',
        label: 'menu.settings',
        subPermissions: [
            'permission',
            'permission.store',
            'permission.edit',
            'permission.update',
            'permission.delete',
            'role',
            'role.store',
            'role.edit',
            'role.update',
            'role.delete',
            'city',
            'city.store',
            'city.edit',
            'city.update',
            'city.delete',
            'province',
            'province.store',
            'province.edit',
            'province.update',
            'province.delete',
            'country',
            'country.store',
            'country.edit',
            'country.update',
            'country.delete',

        ],
        to: "/app/settings/general",
        subs: [
            {
                id: 'permissions',
                icon: "simple-icon-key",
                label: "menu.permissions",
                subPermissions: [
                    'permission',
                    'permission.store',
                    'permission.edit',
                    'permission.update',
                    'permission.delete',
                ],
                to: "/app/permissions",
                subs: [{
                    icon: 'simple-icon-note',
                    label: "menu.create",
                    permissions: 'permission.store',
                    to: "/app/permissions/create",
                },
                    {
                        icon: 'iconsminds-preview',
                        label: "menu.view",
                        permissions: 'permission',
                        to: "/app/permissions/view",
                    }]
            },
            {
                id: 'Roles',
                icon: "iconsminds-key-lock",
                label: "menu.roles",
                subPermissions: [
                    'role',
                    'role.store',
                    'role.edit',
                    'role.update',
                    'role.delete',
                ],
                to: "/app/roles",
                subs: [{
                    icon: 'simple-icon-note',
                    label: "menu.create",
                    permissions: 'role.store',
                    to: "/app/roles/create",
                }, {
                    icon: 'iconsminds-preview',
                    label: "menu.view",
                    permissions: 'role',
                    to: "/app/roles/view",
                }]
            },
            {
                id: 'country',
                icon: "simple-icon-key",
                label: "Countries",
                subPermissions: [
                    'country',
                    'country.store',
                    'country.edit',
                    'country.update',
                    'country.delete',
                ],
                to: "/app/country",
                subs: [{
                    icon: 'simple-icon-note',
                    label: "menu.create",
                    permissions: 'province.store',
                    to: "/app/country/create",
                },
                    {
                        icon: 'iconsminds-preview',
                        label: "menu.view",
                        permissions: 'province',
                        to: "/app/country/view",
                    }]
            },
            {
                id: 'province',
                icon: "simple-icon-key",
                label: "Provinces",
                subPermissions: [
                    'province',
                    'province.store',
                    'province.edit',
                    'province.update',
                    'province.delete',
                ],
                to: "/app/province",
                subs: [{
                    icon: 'simple-icon-note',
                    label: "menu.create",
                    permissions: 'province.store',
                    to: "/app/province/create",
                },
                    {
                        icon: 'iconsminds-preview',
                        label: "menu.view",
                        permissions: 'province',
                        to: "/app/province/view",
                    }]
            },
            {
                id: 'city',
                icon: "simple-icon-key",
                label: "Cities",
                subPermissions: [
                    'city',
                    'city.store',
                    'city.edit',
                    'city.update',
                    'city.delete',
                ],
                to: "/app/city",
                subs: [{
                    icon: 'simple-icon-note',
                    label: "menu.create",
                    permissions: 'city.store',
                    to: "/app/city/create",
                },
                    {
                        icon: 'iconsminds-preview',
                        label: "menu.view",
                        permissions: 'city',
                        to: "/app/city/view",
                    }]
            },

        ]
    },

];
export default data;
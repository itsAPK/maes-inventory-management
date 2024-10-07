import {
  LayoutGrid,
  LucideIcon,
  PackageOpenIcon,
  FileBox,
  Wallet2Icon,
  User,
  UsersIcon,
} from 'lucide-react';

type Submenu = {
  href: string;
  label: string;
  active: boolean;
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: '',
      menus: [
        {
          href: '/',
          label: 'Dashboard',
          active: pathname === '/',
          icon: LayoutGrid,
          submenus: [],
        },
        {
          href: '',
          label: 'Products',
          active: pathname.includes('/product'),
          icon: PackageOpenIcon,
          submenus: [
            {
              href: '/product/new',
              label: 'Add Products',
              active: pathname === '/product/new',
            },
            {
              href: '/product',
              label: 'Product List',
              active: pathname === '/product',
            },
            {
              href: '/product/category',
              label: 'Category',
              active: pathname === '/product/category',
            },
            {
              href: '/product/brand',
              label: 'Brand',
              active: pathname === '/product/brand',
            },
            {
              href: '/product/product-types',
              label: 'Product Types',
              active: pathname === '/product/product-types',
            },
          ],
        },
        {
          href: '',
          label: 'Sales',
          active: pathname.includes('/sales'),
          icon: FileBox,
          submenus: [
            {
              href: '/sales/new',
              label: 'New Sales',
              active: pathname === '/sales/new',
            },

            {
              href: '/sales',
              label: 'Sales List',
              active: pathname === '/sales',
            },
            {
              href: '/sales/group',
              label: 'Sales Group List',
              active: pathname === '/sales/group',
            },
          ],
        },
        {
          href: '',
          label: 'Purchases',
          active: pathname.includes('/purchase'),
          icon: Wallet2Icon,
          submenus: [
            {
              href: '/purchase/new',
              label: 'New Purchase',
              active: pathname === '/purchase/new',
            },
            {
              href: '/purchase',
              label: 'Purchase List',
              active: pathname === '/purchase',
            },
            {
              href: '/purchase/group',
              label: 'Purchase Group List',
              active: pathname === '/purchase/group',
            },
          ],
        },
        {
          href: '',
          label: 'Customers',
          active: pathname.includes('/customers'),
          icon: UsersIcon,
          submenus: [
            {
              href: '/customers/new',
              label: 'Add Customer',
              active: pathname === '/customers/new',
            },
            {
              href: '/customers',
              label: 'Customers List',
              active: pathname === '/customers',
            },
          ],
        },
        {
          href: '',
          label: 'User Management',
          active: pathname.includes('/user'),
          icon: User,
          submenus: [
            {
              href: '/user/new',
              label: 'Add User',
              active: pathname === '/user/new',
            },
            {
              href: '/user',
              label: 'User List',
              active: pathname === '/user',
            },
          ],
        },
        // {
        //   href: "",
        //   label: "Reports",
        //   active: pathname.includes("/user"),
        //   icon: FileBarChart2Icon,
        //   submenus: [
        //     {
        //       href: "/report/sales",
        //       label: "Sales Report",
        //       active: pathname === "/report/sales"
        //     },
        //     {
        //       href: "/report/purchase",
        //       label: "Purchase Report",
        //       active: pathname === "/report/purchase"
        //     },
        //     {
        //       href: "/report/product",
        //       label: "Product Report",
        //       active: pathname === "/report/product"
        //     },
        //     {
        //       href: "/report/customer",
        //       label: "Customer Report",
        //       active: pathname === "/report/customer"
        //     },
        //     {
        //       href: "/report/supplier",
        //       label: "Supplier Report",
        //       active: pathname === "/report/supplier"
        //     },

        //   ]
        // },
        // {
        //   href: "/admin-tools",
        //   label: "Administrative Tools",
        //   active: pathname === "/admin-tools",
        //   icon: Settings,
        //   submenus: []
        // },
      ],
    },
  ];
}

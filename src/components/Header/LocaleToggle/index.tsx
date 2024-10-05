// 'use client';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { Button } from '@/ui/Button';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from '@/ui/Dropdown';
// import { faLanguage } from '@fortawesome/free-solid-svg-icons';
// import { Locale } from '@/i18n/i18nConfig';
// import { useRouter, usePathname } from 'next/navigation';
// import LocaleLink from '@/i18n/LocaleLink';

// export function LocaleToggle() {
//   const pathName = usePathname();
//   const path = pathName.split('/').slice(2).join('/');
//   const localizationDropdown = {
//     ko: '한국어',
//     en: 'English',
//     ja: '日本語',
//     zh: '中文',
//   } as const;

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant='outline' size='icon'>
//           <FontAwesomeIcon icon={faLanguage} className='h-4/5 w-4/5' />
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent>
//         {(Object.keys(localizationDropdown) as Locale[]).map((key) => (
//           <DropdownMenuItem key={key}>
//             {/* <LocaleLink href={path} locale={key}>{localizationDropdown[key]} / {path}</LocaleLink> */}
//             <a href={`/${key}/${path}`} className='w-full'>
//               {localizationDropdown[key]}
//             </a>
//           </DropdownMenuItem>
//         ))}
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }

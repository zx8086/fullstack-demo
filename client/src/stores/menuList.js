// src/stores/menuListStore.js
import { writable } from 'svelte/store';

// This creates a writable store with an initial empty array.
export const menuListStore = writable([]);

// This function will be exported and used to set the menu list based on a given brand.
export function setMenuList(brand) {
  let menuList;

    if (brand === 'TH') {
        menuList = [
          { href: "/01", Div: "01", name: "TH Menswear", img: "/img/divisions/msw.jpg", theme: "theme-th"},
          { href: "/02", Div: "02", name: "Tommy Jeans", img: "/img/divisions/dnm.jpg", theme: "theme-th" },
          { href: "/03", Div: "03", name: "TH Licensing", img: "/img/divisions/licensing.jpg", theme: "theme-th"},
          { href: "/04", Div: "04", name: "TH Kids",img: "/img/divisions/kids.jpg", theme: "theme-th"},
          { href: "/05", Div: "05", name: "TH Womenswear", img: "/img/divisions/wsw.jpg", theme: "theme-th"},
          { href: "/07", Div: "07", name: "TH Bodywear", img: "/img/divisions/bdw.jpg", theme: "theme-th"},
          { href: "/08", Div: "08", name: "Tommy Sport", img: "/img/divisions/sports.jpg", theme: "theme-th"},
          { href: "/09", Div: "09", name: "TH Footwear", img: "/img/divisions/ftw.jpg", theme: "theme-th"},
          { href: "/10", Div: "10", name: "TH Accessories", img: "/img/divisions/acc.jpg", theme: "theme-th"},
          { href: "/11", Div: "11", name: "TH Tailored", img: "/img/divisions/tail.jpg", theme: "theme-th"},
          { href: "/18", Div: "18", name: "TH Collections", img: "/img/divisions/col.jpg", theme: "theme-th"},
        ];
      } else if (brand === 'CK') {
        menuList = [
          { href: "/61", Div: "61", name: "CK Menswear", img: "/img/divisions/msw.jpg", theme: "theme-ck"},
          { href: "/62", Div: "62", name: "CK Jeans", img: "/img/divisions/dnm.jpg", theme: "theme-ck"},
          { href: "/64", Div: "64", name: "CKJ KIDS", img: "/img/divisions/kids.jpg", theme: "theme-ck"},
          { href: "/65", Div: "65", name: "CK Womenswear", img: "/img/divisions/ckwsw.jpg", theme: "theme-ck"},
          { href: "/67", Div: "67", name: "CK Underwear", img: "/img/divisions/bdw.jpg", theme: "theme-ck"},
          { href: "/68", Div: "68", name: "CK Tailored", img: "/img/divisions/tail.jpg", theme: "theme-ck"},
          { href: "/69", Div: "69", name: "CK Footwear", img: "/img/divisions/ckftw.jpg", theme: "theme-ck"},
          { href: "/70", Div: "70", name: "CK Accessories", img: "/img/divisions/acc.jpg", theme: "theme-ck"},
          { href: "/77", Div: "77", name: "CK Swimwear", img: "/img/divisions/swm.jpg", theme: "theme-ck"},
        ];
      } else if (brand === 'NIKE') {
        menuList = [
          { href: "/97", Div: "97", name: "Nike Underwear", img: "/img/divisions/nike.jpg", theme: "theme-nike"},
        ];
      } else {
        menuList = [];
      }

  // This updates the menuListStore with the new value
  menuListStore.set(menuList);
}

import React from 'react'

const Footer = () => {
  return (
    <footer class="bg-slate-800 bg-opacity-90 py-12 px-6 text-gray-200">
        <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
        <span class="font-headline font-black text-2xl">Creator-Lift</span>
        <p class="text-on-surface-variant font-body mt-2">The Intentional Curator for Digital Talent.</p>
        </div>
        <div class="flex gap-12">
        <div class="flex flex-col gap-2">
        <span class="font-bold text-on-background">Company</span>
        <a class="text-on-surface-variant hover:text-primary" href="#">About</a>
        <a class="text-on-surface-variant hover:text-primary" href="#">Journal</a>
        </div>
        <div class="flex flex-col gap-2">
        <span class="font-bold text-on-background">Legal</span>
        <a class="text-on-surface-variant hover:text-primary" href="#">Privacy</a>
        <a class="text-on-surface-variant hover:text-primary" href="#">Terms</a>
        </div>
        </div>
        </div>
        <div class="max-w-7xl mx-auto mt-12 pt-8 border-t border-outline-variant/20 flex justify-between items-center text-sm text-on-surface-variant">
        <p>© 2026 Creator-Lift. All rights reserved.</p>
        <div class="flex gap-4">
        <span class="material-symbols-outlined cursor-pointer hover:text-primary" data-icon="language">language</span>
        <span class="material-symbols-outlined cursor-pointer hover:text-primary" data-icon="share">share</span>
        </div>
        </div>
  </footer>
  )
}

export default Footer
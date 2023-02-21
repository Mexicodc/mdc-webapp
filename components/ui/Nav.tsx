import MENU_ITEMS from '../../lib/data/MenuItems'

import NavLink from './NavLink'

function Nav() {
  return (
    <nav className="hidden md:flex items-center">
      <ul className="flex items-center" role="list">
        {MENU_ITEMS.map((item, idx) => (
          <NavLink key={item.slug + idx} linkText={item.name} slug={item.slug} />
        ))}
      </ul>
    </nav>
  )
}

export default Nav

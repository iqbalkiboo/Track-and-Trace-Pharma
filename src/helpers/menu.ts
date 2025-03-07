
// export function generateToLink( type: string): string {
//     const foundedMenu = subMenu.filter((item) => accessArry.includes(item.access))
//     return `${type}${foundedMenu[0].link}` 
// }

const permission = localStorage.getItem("authPermission")
const accessArry = permission ? JSON.parse(permission) : []

export function generateToLink(
  type: string,
  typeUser: string,
  menus: { name: string; access: string; link: string }[]
) {
  try {
    if (typeUser === "5up3r4dm1n") {
      const foundedMenu = menus
      const links = foundedMenu.filter((item) => item.link)
      return `${type}${links[0].link}`
    } else {
      const foundedMenu = menus.filter((item) =>
        accessArry.includes(item.access)
      )
      const links = foundedMenu.filter((item) => item.link)
      return `${type}${links[0].link}`
    }
  }
  catch (err) {
    console.log(err)
    return `${type}`
  }
}

import { auth } from "@/models/auth"

const authData = ref<any>()
authData.value = auth.getAuth()

function getSuperholdingId() {
  let company_id: string = ""
  if (authData.value.xxtype === "5up3r4dm1n") {
    company_id = authData.value["xx-usertype-access"]?.superholding_id
  } else {
    company_id = authData?.value?.users?.user_type?.id
  }

  return company_id
}

export default getSuperholdingId()

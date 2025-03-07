import { auth } from "@/models/auth"

const authData = ref<any>()
authData.value = auth.getAuth()

function getHoldingId() {
  let holding_id = ""
  if (authData.value.xxtype === "5up3r4dm1n") {
    holding_id = authData.value["xx-usertype-access"]?.holding_id
  } else {
    holding_id =
      authData?.value?.users?.holding_id || "000000000000000000000000"
  }

  return holding_id
}

export default getHoldingId()

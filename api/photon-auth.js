export default async function handler(req, res) {
  const d = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});
  const ticket = d.Ticket || req.query.Ticket;
  console.log("body:", JSON.stringify(d), "query:", JSON.stringify(req.query));
  try {
    const r = await fetch("https://PUTYOURTITLEIDHERE.playfabapi.com/Server/AuthenticateSessionTicket", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-SecretKey": process.env.PLAYFAB_SECRET },
      body: JSON.stringify({ SessionTicket: ticket })
    });
    const j = await r.json();
    console.log("playfab:", JSON.stringify(j));
    if (j.code === 200) {
      return res.json({ ResultCode: 1, UserId: j.data.UserInfo.PlayFabId });
    }
    return res.json({ ResultCode: 2, Message: "bad ticket" });
  } catch (e) {
    console.log("error:", String(e));
    return res.json({ ResultCode: 2, Message: "error" });
  }
}
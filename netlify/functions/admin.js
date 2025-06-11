// If your project uses ESM (package.json: "type":"module") you can use `import`.
// Otherwise switch to CommonJS (`const { createClient } = require(...)`).

import { createClient } from '@supabase/supabase-js'

// Pull in your secrets from process.env
const supabaseUrl = process.env.SUPABASE_DATABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAdmin = createClient(supabaseUrl, supabaseKey)

export async function handler(event, context) {
  // Optional: only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  // Example: parse an `id` from the client
  const { id } = JSON.parse(event.body)

  // Perform a privileged operation (bypasses RLS)
  const { data, error } = await supabaseAdmin
    .from('designs')
    .delete()
    .eq('id', id)

  if (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ data }),
  }
}

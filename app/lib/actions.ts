'use server'
import { z } from 'zod';
import { revalidatePath } from 'next/cache'
import {redirect} from 'next/navigation'
import postgres from 'postgres';


const sql = postgres(process.env.POSTGRES_URL!,{ssl: 'require'})
 
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(
    {invalid_type_error: 'please select  customer'}
  ),
  amount: z.coerce.number()
  .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], { invalid_type_error: 'Please select an invoice status.',}),
  date: z.string(),
});
 
const UpdateInvoice = FormSchema.omit({ id: true, date: true });
export async function updateInvoice(formData: FormData){
    const {customerId, amount, status} = UpdateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });
    const amountInCent =amount * 100;
    const date = new Date().toISOString().split('T')[0]

   try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCent}, ${status}, ${date})
    `;
  } catch (error) {
   
    console.error(error);
}

    //  await sql`UPDATE invoices
    // SET customer_id = ${customerId}, amount = ${amountInCent}, status = ${status},
    // WHERE id = ${id}`;
  
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  throw new Error('Failed to Delete Invoice');
  await sql`DELETE FROM invoices WHERE id = ${id}`;
  revalidatePath('/dashboard/invoices');
}
import { createClient } from '@supabase/supabase-js';

// Se crea una instancia del cliente de Supabase utilizando la URL y la clave pública del proyecto
export const supabase = createClient(
    'https://nrpckfazjiongvscvazk.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ycGNrZmF6amlvbmd2c2N2YXprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwMjczMjgsImV4cCI6MjA5NDYwMzMyOH0.xKpV6-sN98Ktqdk66BEzRXrvdtFBuxUrCFe3Ql2Kvwo'
);
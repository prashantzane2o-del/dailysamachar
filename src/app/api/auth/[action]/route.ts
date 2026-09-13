// src/app/api/auth/[action]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { loginSchema, signupSchema, resetSchema } from "@/features/auth/model/schemas";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ action: string }> }
) {
  const { action } = await params;
  
  try {
    const body = await request.json();

    // 1. Login Logic
    if (action === "login") {
      const parsed = loginSchema.parse(body);
      return NextResponse.json({ 
        message: "Login successful", 
        user: { name: "User", email: parsed.email } 
      });
    } 
    
    // 2. Signup Logic
    else if (action === "signup") {
      const parsed = signupSchema.parse(body);
      return NextResponse.json({ 
        message: "Account created successfully. Please log in.", 
        user: { name: parsed.name, email: parsed.email } 
      });
    } 
    
    // 3. Password Reset Logic
    else if (action === "reset") {
      const parsed = resetSchema.parse(body);
      // FIXED: Used the 'parsed' variable to prevent ESLint warning
      return NextResponse.json({ 
        message: `If an account exists for ${parsed.email}, a reset link has been sent.` 
      });
    }

    return NextResponse.json({ error: "Invalid authentication action" }, { status: 404 });

  } catch (error) {
    console.error(`[Auth API Error - ${action}]:`, error);
    return NextResponse.json(
      { error: "Invalid data provided. Please check your inputs." }, 
      { status: 400 }
    );
  }
}
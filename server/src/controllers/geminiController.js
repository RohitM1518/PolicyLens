import { asyncHandler } from "../utils/asyncHandler.js";
import APIError from "../utils/apiError.js";
import APIResponse from "../utils/apiResponse.js";
import { model, fileManager } from "../config/geminiConfig.js";
import fs from 'fs' //This is the file system from the node js
import axios from 'axios';
import { getQueryResults } from '../rag/retriveDocument.js';

function formatUserContext(user) {
    return `
  User Details:
  - Name: ${user.name ?? "Not provided"}
  - Age: ${user.age ?? "Not provided"}
  - Location: ${user.location ?? "Not provided"}
  - Marital Status: ${user.maritalStatus ?? "Not provided"}
  - Occupation: ${user.occupation ?? "Not provided"}
  - Monthly Salary: ₹${user.monthlySalary ?? 0}
  - Annual Income: ₹${user.annualIncome ?? 0}
  - Coverage Amount Preference: ₹${user.coverageAmountPreference ?? 0}
  - Family Size: ${user.familySize ?? "Not provided"}
  - Health Status: ${user.healthStatus ?? "Not provided"}
  - Health Conditions in Family: ${user.healthConditionsInFamily?.length ? user.healthConditionsInFamily.join(", ") : "None"
        }
  - Lifestyle Habits: ${user.lifestyleHabits?.join(", ") ?? "None"}
  - Existing Insurance Policies: ${user.existingInsurancePolicies?.length ? user.existingInsurancePolicies.join(", ") : "None"
        }
  - Vehicle Ownership: ${user.vehicleOwnership ? "Yes" : "No"}
  - Travel Habits: ${user.travelHabits ?? "Not provided"}
  - Past Claims History: ${user.pastClaimsHistory ? "Yes" : "No"}
  - Existing Debts: ₹${user.existingDebts ?? 0}
  - Primary Goal for Insurance: ${user.primaryGoalForInsurance ?? "Not provided"}
  - Willingness to Pay Premiums: ${user.willingnessToPayPremiums ?? "Not provided"}
    `;
}


const getResponse = async (prompt, language) => {
    // console.log(prompt);
    const newPrompt = `${prompt}+\nConvert above into ${language} and do not give any extra information`;
    try {
        const result = await model.generateContent(newPrompt);
        console.log(result.response.text());
        return result.response.text();
    } catch (error) {
        console.log(error);
    }
}

const generateTitle = async (prompt) => {
    try {
        const newPrompt = prompt + " Generate a exact one title for this chat without any extra information and maximum of 5 words";
        const title = await model.generateContent(newPrompt);
        return title.response.text();
    } catch (error) {
        console.log(error)
    }
}

const generateSummary = async (fileName, user) => {
    console.log(fileName)
    const uploadResponse = await fileManager.uploadFile(`./public/temp/${fileName}`, {
        mimeType: "application/pdf",
        displayName: "Gemini 1.5 PDF",
    });

    // View the response.
    console.log(
        `Uploaded file ${uploadResponse.file.displayName} as: ${uploadResponse.file.uri}`,
    );
    //TODO: Check instead of cloudinary can we use this

    const userContext = formatUserContext(user);
    // Generate content using text and the URI reference for the uploaded file.
    const prompt = `You are an expert in summarizing insurance policies. Extract and summarize the following insurance policy terms and conditions into concise and clear bullet points. Ensure you include the following aspects:

- **Policy Coverage**: What is covered by the insurance, including inclusions and exclusions (e.g., natural disasters, theft, pre-existing conditions).
- **Claim Process and Timelines**: How to file a claim and the time limits for doing so.
- **Premium Payment Requirements**: When and how the premium should be paid.
- **Cancellation and Refund Policies**: What happens if the policy is canceled (e.g., refund amounts, cancellation terms).
- **Dispute Resolution Mechanisms**: How disputes will be handled (e.g., arbitration, legal proceedings).

**Ensure**:
- **Clarity**: The summary should be simple and easy to understand.
- **Completeness**: Cover all major points without unnecessary legal jargon.

Summarized Terms and Conditions:

Given the summarized insurance policy details and the user’s information, analyze the alignment between the policy and the user’s specific needs. Consider the following aspects:

- **Affordability**: Does the premium fit within the user’s disposable income (i.e., monthly salary, annual income)?
- **Coverage Adequacy**: Does the sum insured and the coverage amount align with the user’s family size, number of dependents, and personal risk factors (e.g., health status, existing debts)?
- **Policy Exclusions**: Are there any exclusions that could significantly affect the user (e.g., exclusions for pre-existing health conditions or occupation-related risks)?
- **Suitability**: Does the policy tenure, benefits, and terms match the user’s primary insurance goals (e.g., family protection, saving for future needs, tax benefits)?
${userContext}
Alignment Analysis:

Based on the summarized policy and user alignment analysis, assign a score (out of 10) to indicate how well the policy aligns with the user’s requirements. Provide the rationale for the score and offer 2-3 actionable recommendations based on the evaluation.

**Scoring Criteria**:
- **Coverage Relevance (3 points)**: Does the policy cover the user's specific needs? 
- **Affordability (2 points)**: Is the policy financially viable for the user?
- **Exclusion Impact (2 points)**: Do exclusions significantly affect the user? 
- **Additional Benefits (3 points)**: Does the policy offer valuable add-ons (e.g., riders, tax benefits)?


Output:
- **Overall Score**: [Score out of 10]
- **Justification**: [Why this score was given]
- **Recommendations**: [Provide 2-3 actionable suggestions, such as adjusting coverage, choosing different policy terms, or considering additional riders]

`
    const result = await model.generateContent([
        {
            fileData: {
                mimeType: uploadResponse.file.mimeType,
                fileUri: uploadResponse.file.uri,
            },
        },
        { text: prompt },
    ]);

    // Output the generated text to the console
    console.log(result.response.text());
    fs.unlinkSync(`./public/temp/${fileName}`);
    return result.response.text();
}

const chatBot = async (prompt, messageId, chatId, accessToken,user) => {
    // const { prompt } = req.body;
    const messages = await axios.get(`${process.env.BACKEND_URL}/chat/message/get/${chatId}`, {
        withCredentials: true,
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    // console.log(messages.data.data);
    const history = messages.data.data.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.message.trim() }]
    }));
    
    const userContext = formatUserContext(user);


    const chat = model.startChat({
        history: history
    });
    let oldMsg = "";
    messages.data.data.map(msg => {
        oldMsg += msg.message.trim();
    })
    const ragPrompt = `${prompt} Old Message Context: ${oldMsg}`
    //TODO: Get the documents using rag
    const ragResult = await getQueryResults(ragPrompt, messageId, chatId);
    // console.log("MSG and CHAT ID"+messageId+" "+chatId);
    console.log("Rag results");
    console.log(ragResult);
    let textDocuments = "";
    ragResult.forEach(doc => {
        textDocuments += doc.document.pageContent;
    });
    let result = await chat.sendMessage( `${prompt} Context: ${textDocuments} User Context: ${userContext} Instead of User name use it as first Person pronoun`);
    return result.response.text();
    // return res.status(200).json(new APIResponse(200, { data: result.response.text() }, "Response generated successfully"));
}

const generateSuggestedMessages = async (messages,user) => {
    const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
    };  
    const messageText = messages.map(msg => msg.message).join('\n');
    const chatSession = model.startChat({
        generationConfig,
        history:[
            {
                "role": "user",
                "parts": [
                    {
                        "text": messageText+"These are the users last asked questions based on this I want you to generate 6 suggested questions to user that user may ask in future and do not give any extra answer"
                    }
                ]
            }
        ]
})
    const userContext = formatUserContext(user);
    const result = await chatSession.sendMessage(`Generate Next 6 Questions based \nMy Context:${userContext}`);
    return result.response.text();
}
export {
    getResponse,
    generateSummary,
    chatBot,
    generateTitle,
    generateSuggestedMessages
}
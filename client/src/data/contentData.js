import { features1, features2, features3, features4, features5, features6, features7, features8, features9, finance_icon, org_icon, sso_icon,hrms_icon, prfile1_icon, prfile2_icon, prfile3_icon, support1_icon, support2_icon } from "../assets/icon"


const signupUrl= 'https://login-client.victoriousplant-d49987f1.centralindia.azurecontainerapps.io/sign-up'
const navbarElement = [
    { name: 'Blogs' , url:'/blogs'},
    {name: 'Features', url:'/features'},
    {name: 'Pricing', url:'/pricing'},
    {name:'Integrations', url:'/integration'}
 ]

//homepage block one
 const block1={
    title1:'The World’s Most Configurable',
    title2:'Travel & Expense Management Software',
    content:'Configure any rule. Enable a world class mobile experience for your users. Get seamless reporting & integrations. Inbuilt OCR expense scanning. Manage travel & non-travel expenses. Open APIs to connect with external systems.'
 }


 const applicationUsers = [

    {comapnyName: '', img: org_icon},
    {comapnyName: '', img: org_icon},
    {comapnyName: '', img: org_icon},
    {comapnyName: '', img: org_icon},
    {comapnyName: '', img: org_icon},
    {comapnyName: '', img: org_icon},
    {comapnyName: '', img: org_icon},
    {comapnyName: '', img: org_icon},
    {comapnyName: '', img: org_icon},
    {comapnyName: '', img: org_icon},
  
 ]


 const features = [
    {
        icon:features1,
        title:'Setup Employee Groups',
        content:"Use any parameter to setup distinct employee groups to implement policies",
        style:'w-6 h-3'
    },
    {
        icon:features2,
        title:'The Definitive Rule Engine',
        content:'Configure ANY policy - and if you can’t configure it, we promise to work on it for free',
        style:'w-6 h-6'
    },
    {
        icon:features3,
        title:'Customized Reports',
        content:'Setup the reports that you want using our seamless reporting engine.',
        style:'w-4 h-5'
    },
    {
        icon:features4,
        title:'Superior Employee Experience',
        content:'Manage all expenses and travel requests easily. Empower your employees with personalized reports.',
        style:'w-6 h-6'
    },
    {
        icon:features5,
        title:'Easy Integrations',
        content:'Integrate with your upstream, HRMS or your downstream finance system to seamlessly deliver value through our Open APIs.',
        style:'w-6 h-6'
    },
    {
        icon:features6,
        title:'Configurable Workflows',
        content:'Configure approvals or rejections. Escalations and reports. At will. Setup new groups.',
        style:'w-[21px] h-[21px]'
    },
    {
        icon:features7,
        title:'Scan any Bill',
        content:'The world’s best OCR system backs up this product. All data goes in. 99% success.',
        style:'w-[20px] h-[22px]'
    },
    {
        icon:features8,
        title:'AI-Based Concierge',
        content:'Ask the concierge to change things during your travel - and it will trigger relevant actions 24x7.',
        style:'w-[22px] h-[20px]'
    },
    {
        icon:features9,
        title:'AI-Assisted Trip Planning',
        content:'Just tell us what you want to do in normal language and we will try and put together the best itinerary for you.',
        style:'w-5 h-5'
    }
 ]


 const integrantions = [
    {
        icon:hrms_icon,
        title:'HRMS Systems',
        content1:'We can integrate with any HRMS as long as the employee master can be made available to us over SFTP/API.',
        content2:'We are already deeply integrated with PeopleStrong and others are coming up.',
        style:{
            box:'from-white to-amber-400/10 border-amber-400',
            iconBg:'bg-amber-300/30'
        }
    },
    {
        icon:finance_icon,
        title:'Finance Systems',
        content1:'Connect us with your finance systems to get all cost centers mapped, and all data reconciled on a periodic/regular basis.',
        content2:'Open APIs available to connect.',
        style:{
            box:'from-white to-lime-400/10 border-lime-400',
            iconBg:'bg-lime-300/30'
        }
    },
    {
        icon:sso_icon,
        title:'Single Sign-on Systems',
        content1:'We can integrate to ensure that your users don’t have to log in multiple times into different logins.',
        content2:'SSO is possible with any system that offers it.',
        style:{
            box:'from-white to-indigo-400/10 border-indigo-400',
            iconBg:'bg-indigo-300/30'
        }
    }
 ]
    

 const userReviews= [
    {
        icon: prfile1_icon,
        name:'Rohit Mehra',
        details:'CFO, XYZ',
        review:'ExpenseBook has truly streamlined our travel setup. No more emails and delays in booking. No mor unknown overruns in expense. Everything is trackable, and the configurability they offer is outstanding.'
        ,style:'bg-indigo-400/10 border-indigo-400'
    },
    {
        icon:prfile2_icon,
        name:'Alan Turing',
        details:'CFO, XYZ',
        review:'ExpenseBook has streamlined our travel setup effortlessly. No more delays in booking or unknown overruns in expenses. The transparency and outstanding configurability make it a game-changer for our organization.'
        ,style:'bg-blue-50 border-blue-400'
    },
    {
        icon: prfile3_icon,
        name:'John Jocab',
        details:'CFO, XYZ',
        review: "ExpenseBook eliminates the hassle of expense management. It's a simple, trackable solution with outstanding configurability. Our process is more efficient, thanks to this invaluable tool."
        ,style:'bg-violet-400/10 border-violet-400'
    }
 ]


 //pricing

 const pricingData = [
    {
        version:'FREE',
        currencySymbol: '₹',
        cost: {
            monthly : '0',
            yearly:'0'
        },
        billedOn: 'Per user/month Billed annually',
        minimumUsers:'',
        buttonLabel:'Get Started',
        appropriateFor:'For small businesses and freelancers to track expenses and mileage claims',
        features:{
            title: 'What you get:',
            points:[
                'Up to 3 users',
                '5 GB Receipt storage',
                '20 Receipt autoscans',
                'Multicurrency expenses',
                'Mileage expenses',
                'Customer/Project Tracking',
                'Accounting Integration',
                'Email Support'
            ]
        }

    },
    {
        version:'STANDARD',
        currencySymbol: '₹',
        cost: {
            monthly : '100',
            yearly:'149'
        },
        billedOn: 'Per user/month Billed annually',

        buttonLabel:'Start your free trial',
        minimumUsers:'10',
        appropriateFor:'For growing businesses to manage corporate cards and streamline end-to-end expense reporting.',
        // plan:'Free plan +',
        features:{
            title: 'Free plan +',
            points:[
                '20 Receipt Autoscans per user',
                'Corporate Card Reconciliation',
                'Cash Advances',
                'Multilevel Approval',
                'Access Delegation',
                'Basic Audit Trail Report',
                'Email, call and remote assistance',
            ]
        }

    },
    {
        version:'PREMIUM',
        currencySymbol: '₹',
        cost: {
            monthly : '299',
            yearly:'199'
        },
        billedOn: 'Per user/month Billed annually',

        buttonLabel:'Start your free trial',
        minimumUsers:'10',
        appropriateFor:'For global businesses with high volume of expenses, in need of powerful controls and robust workflows.',
        // plan:'Free plan +',
        features:{
            title: 'Standard plan +',
            points:[
                'Receipt Autoscan',
                'Travel Requests',
                'Purchase Requests',
                'Advanced Approval',
                'Per Diem Automation',
                'Advanced Customization',
            ]
        }

    },
    {
        version:'ENTERPRISE',
        currencySymbol: '₹',
        cost: {
            monthly : '399',
            yearly:'349'
        },
        billedOn: 'Per user/month Billed annually',

        buttonLabel:'Contact us',
        minimumUsers:'100',
        appropriateFor:'Built for businesses that need a highly customizable and integrated solution to suit their complex needs.',
        // plan:'Free plan +',
        features:{
            title: 'Premium plan +',
            points:[
                'TMS/OTA Integration',
                'ERP Integration',
                'Single Sign On (SAML)',
                'Dedicated Account Manager',
                'Advanced Audit Trail Report',
            ]
        }

    }
 ]


const addOnes= [

    {
        icon:support1_icon,
        title:'Premium Support',
        shortDes:'Personalized support anytime',
        service:[
            '24/7 Support',
            'Live Chats',
            'Dedicated call support',
            'One-on-one Sessions'
        ],
        cost:'₹40,000/Year',
        linkTitle:'View Premium Support Plans',
        linkUrl:''
    },
    {
        icon:support2_icon,
        title:'Jumpstart',
        shortDes:'Expert guidance to kickstart your onboarding',
        service:[
            'Dedicated product expert for onboarding',
            'Training',
            'ERP/HRMS/Accounting integrations',
            'Hypercare'
        ],
        cost:'₹500/Year',
        linkTitle:'View Jumpstart Plans',
        linkUrl:''
    }

]

const trustedByData= [

    'Amazon','Apple','Microsoft','Sony','IBM','Cisco Systems','People Strong'
]


const FAQs = [
    {title:'',
     content: "Yes, each of our subscription plans comes with a specific minimum user license requirement: - Standard - 10 /n - Premium - 10 \n - Enterprise - 100 \n However, there's no maximum limit on the number of user licenses you can purchase. "}
]


const blogsData=[
    {
        heading:'Streamlining Expense Reporting in the Government & Private Sector :  A Comprehensive Guide for all and everyone',
        date:'29 January 2024',
        articleUrl:'/myReviews'

    },
    {
        heading:'Streamlining Expense Reporting in the Government & Private Sector :  A Comprehensive Guide for all and everyone',
        date:'29 January 2024',
        articleUrl:'/myReviews'

    },
    {
        heading:'Streamlining Expense Reporting in the Government & Private Sector :  A Comprehensive Guide for all and everyone',
        date:'29 January 2024',
        articleUrl:'/myReviews'

    },
    {
        heading:'Streamlining Expense Reporting in the Government & Private Sector :  A Comprehensive Guide for all and everyone',
        date:'29 January 2024',
        articleUrl:'/myReviews'

    },
    {
        heading:'Streamlining Expense Reporting in the Government & Private Sector :  A Comprehensive Guide for all and everyone',
        date:'29 January 2024',
        articleUrl:'/myReviews'

    },
    {
        heading:'Streamlining Expense Reporting in the Government & Private Sector :  A Comprehensive Guide for all and everyone',
        date:'29 January 2024',
        articleUrl:'/myReviews'

    },
    {
        heading:'Streamlining Expense Reporting in the Government & Private Sector :  A Comprehensive Guide for all and everyone',
        date:'29 January 2024',
        articleUrl:'/myReviews'

    }
]

const blogPageData = {
    heading:'Streamlining Expense Reporting in the Government & Public Sector: A Comprehensive Guide',
    date:'29 January 2024',
    imgUrl:'https://images-eds-ssl.xboxlive.com/image?url=4rt9.lXDC4H_93laV1_eHHFT949fUipzkiFOBH3fAiZZUCdYojwUyX2aTonS1aIwMrx6NUIsHfUHSLzjGJFxxtvMx_t5ZkilsBu_r7whbv.t3X_rZRQMaVQHNtwcvk_ZUa2hlCm.nnOukBFZa.I_yz7h9o1y0YP6bJ0pwLbeCbw-&format=source',
    content:"Imagine a world where every dollar of taxpayer money is accounted for and used strategically. That world begins with efficient expense reporting in the government and public sector. It can directly influence the success of public projects, policy rollouts, and the overall public trust in government operations. “Efficiency and transparency in expense reporting signify responsible financial management, a cornerstone of any reputable government body.”However, efficient expense management in the public sector is not without its challenges. These challenges not only test the administrative capabilities of the organizations involved but also their commitment to integrity and transparency. From improving outdated systems, and grappling with a lack of standardization to tackling the suspected misuse of funds, each difficulty demands tactful navigation and strategic solutions. Navigating these hurdles can feel overwhelming, but remember, proper management of resources is pivotal to ensuring the government and public sector bodies can meet their objectives."

}


 


 export {signupUrl,blogPageData,blogsData,trustedByData,navbarElement,applicationUsers,features,integrantions,userReviews,pricingData,addOnes}  
#!/bin/bash

echo "🔍 ClickChutney Deployment Validation"
echo "====================================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
    else
        echo -e "${RED}✗${NC} $2"
    fi
}

# Check prerequisites
echo -e "\n${YELLOW}📋 Prerequisites Check${NC}"
command_exists node && node_version=$(node --version) || node_version="Not installed"
command_exists npm && npm_version=$(npm --version) || npm_version="Not installed"
command_exists aws && aws_version=$(aws --version 2>&1 | cut -d' ' -f1) || aws_version="Not installed"

print_status $(command_exists node) "Node.js: $node_version"
print_status $(command_exists npm) "NPM: $npm_version"
print_status $(command_exists aws) "AWS CLI: $aws_version"

# Check NPM login
echo -e "\n${YELLOW}🔐 NPM Authentication${NC}"
npm_user=$(npm whoami 2>/dev/null)
if [ $? -eq 0 ]; then
    print_status 0 "NPM logged in as: $npm_user"
else
    print_status 1 "NPM not logged in. Run 'npm login'"
fi

# Check package structure
echo -e "\n${YELLOW}📦 Package Structure${NC}"
analytics_pkg="plugin/npm/analytics/package.json"
nextjs_pkg="plugin/npm/nextjs/package.json"
lambda_pkg="plugin/lambda/analytics-tracker/package.json"

print_status $(test -f $analytics_pkg) "Analytics package.json exists"
print_status $(test -f $nextjs_pkg) "Next.js package.json exists"
print_status $(test -f $lambda_pkg) "Lambda package.json exists"

# Check if packages can be built
echo -e "\n${YELLOW}🔨 Build Check${NC}"

# Analytics package
if [ -f $analytics_pkg ]; then
    cd plugin/npm/analytics
    if [ -d "node_modules" ]; then
        npm run build >/dev/null 2>&1
        print_status $? "Analytics package builds successfully"
    else
        print_status 1 "Analytics package dependencies not installed"
    fi
    cd ../../..
fi

# Next.js package
if [ -f $nextjs_pkg ]; then
    cd plugin/npm/nextjs
    if [ -d "node_modules" ]; then
        npm run build >/dev/null 2>&1
        print_status $? "Next.js package builds successfully"
    else
        print_status 1 "Next.js package dependencies not installed"
    fi
    cd ../../..
fi

# Lambda package
if [ -f $lambda_pkg ]; then
    cd plugin/lambda/analytics-tracker
    if [ -d "node_modules" ]; then
        npm run build >/dev/null 2>&1
        print_status $? "Lambda function builds successfully"
    else
        print_status 1 "Lambda dependencies not installed"
    fi
    cd ../../..
fi

# Check environment variables template
echo -e "\n${YELLOW}🌍 Environment Setup${NC}"
if [ -f ".env.example" ] || [ -f ".env.template" ]; then
    print_status 0 "Environment template exists"
else
    print_status 1 "No environment template found"
fi

# Check database configuration
echo -e "\n${YELLOW}🗄️  Database Check${NC}"
if grep -q "DATABASE_URL" prisma/schema.prisma 2>/dev/null; then
    print_status 0 "Prisma schema configured"
else
    print_status 1 "Prisma schema not found or not configured"
fi

# Check .gitignore
echo -e "\n${YELLOW}📄 Git Configuration${NC}"
if [ -f ".gitignore" ]; then
    if grep -q "plugin/npm/.*node_modules" .gitignore; then
        print_status 0 ".gitignore properly configured"
    else
        print_status 1 ".gitignore missing plugin configurations"
    fi
else
    print_status 1 ".gitignore not found"
fi

# Summary
echo -e "\n${YELLOW}📋 Deployment Readiness Summary${NC}"
echo "1. Ensure all prerequisites are installed"
echo "2. Login to NPM: npm login"
echo "3. Install dependencies in all packages"
echo "4. Set up MongoDB connection string"
echo "5. Configure AWS credentials"
echo "6. Follow DEPLOYMENT_GUIDE.md for step-by-step instructions"

echo -e "\n${GREEN}🚀 Ready to deploy!${NC}"
echo "Run the following commands to start deployment:"
echo ""
echo "# 1. Build and publish NPM packages"
echo "cd plugin/npm/analytics && npm install && npm run build && npm publish"
echo "cd ../nextjs && npm install && npm run build && npm publish"
echo ""
echo "# 2. Deploy Lambda function"
echo "cd ../../lambda/analytics-tracker && npm install && npm run package"
echo "# Then upload the zip file to AWS Lambda"
echo ""
echo "# 3. Test with sample site"
echo "# Follow Phase 4 in DEPLOYMENT_GUIDE.md"
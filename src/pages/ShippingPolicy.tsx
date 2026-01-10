import React from 'react';
import Layout from '@/components/layout/Layout';
import SEO from '@/components/common/SEO';
import ShippingPolicyText from '@/components/policies/ShippingPolicyText';

const ShippingPolicy = () => {
    return (
        <Layout>
            <SEO title="Shipping Policy | JB Creations" description="Read our shipping policy regarding delivery times and methods." />
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <h1 className="font-display text-4xl font-bold mb-8">Shipping Policy</h1>
                <ShippingPolicyText />
            </div>
        </Layout>
    );
};

export default ShippingPolicy;

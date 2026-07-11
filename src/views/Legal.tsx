import React from 'react';
import { Shield, FileText } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function Legal() {
  const { t, language, dir } = useLanguage();
  const isAr = language === 'ar';

  return (
    <div className="max-w-4xl mx-auto py-8 animate-in fade-in" dir={dir}>
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4">{t('legal.title')}</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">{t('legal.desc')}</p>
      </div>

      <div className="space-y-8">
        <div className="tech-panel p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-cyan-50 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 rounded-sm">
              <Shield className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">{isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}</h2>
          </div>
          
          <div className="space-y-6 text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm">
            {isAr ? (
              <div className="p-4 bg-zinc-50 dark:bg-zinc-950/50 rounded-sm mb-6">
                <p className="text-xs text-zinc-500 dark:text-zinc-500 mb-4">آخر تحديث: 26 يونيو 2026</p>
                <p className="mb-4">توضح سياسة الخصوصية هذه كيفية تعامل TestPilot مع المعلومات عند استخدامك للموقع والخدمات.</p>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-zinc-800 dark:text-zinc-200">1. المعلومات التي نجمعها</h3>
                    <p>نجمع فقط المعلومات الضرورية لتشغيل الخدمة وتحسينها. وقد يشمل ذلك بيانات فحص مؤقتة، وبيانات تقنية مرتبطة بالطلب، ومعلومات معالجة مؤقتة لازمة لإتمام الفحص. لا نحتفظ بملفات المستخدمين أو مشاريعهم بشكل دائم على خوادمنا.</p>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-zinc-800 dark:text-zinc-200">2. كيفية استخدام المعلومات</h3>
                    <p>نستخدم بيانات المعالجة المؤقتة فقط لتحليل المحتوى المرسل، وتوليد التقارير، وعرض النتائج، والحفاظ على استمرارية الخدمة. لا نستخدم البيانات المحتفظ بها للتسويق أو التتبع أو تدريب النماذج.</p>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-zinc-800 dark:text-zinc-200">3. مدة الاحتفاظ بالبيانات</h3>
                    <p>أي بيانات تُحفظ على خوادمنا يتم الاحتفاظ بها فقط للمدة اللازمة لمعالجة الطلب وضمان استمرارية الخدمة. ويتم حذف جميع البيانات المخزنة على الخادم تلقائيًا خلال 24 ساعة كحد أقصى. ولا نحتفظ بنسخ دائمة من مشاريع المستخدمين أو نتائج الفحص أو التقارير.</p>
                  </div>
  
                  <div>
                    <h3 className="font-bold text-zinc-800 dark:text-zinc-200">4. التخزين المحلي على جهازك</h3>
                    <p>إذا اخترت حفظ السجل أو الإعدادات، فإن هذه البيانات تبقى على جهازك فقط ولا تُخزن على خوادمنا. ويكون هذا التخزين خاضعًا لمتصفحك أو جهازك ويمكنك حذفه في أي وقت.</p>
                  </div>
  
                  <div>
                    <h3 className="font-bold text-zinc-800 dark:text-zinc-200">5. المشاركة والإفصاح</h3>
                    <p>نحن لا نبيع البيانات الشخصية. ولا نشارك مشاريع المستخدمين أو نتائج الفحص مع أي طرف ثالث إلا عند الضرورة لتشغيل الخدمة أو الامتثال للالتزامات القانونية.</p>
                  </div>
  
                  <div>
                    <h3 className="font-bold text-zinc-800 dark:text-zinc-200">6. الأمان</h3>
                    <p>نطبّق إجراءات تقنية وتنظيمية معقولة لحماية بيانات المعالجة المؤقتة أثناء الاستخدام. ومع ذلك، لا توجد طريقة نقل أو تخزين آمنة بنسبة 100%.</p>
                  </div>
  
                  <div>
                    <h3 className="font-bold text-zinc-800 dark:text-zinc-200">7. حقوقك</h3>
                    <p>بحسب القوانين المعمول بها في بلدك، قد تكون لديك حقوق الوصول إلى بياناتك أو تصحيحها أو حذفها. وبما أن الاحتفاظ على الخادم مؤقت، فإن معظم البيانات المخزنة على الخادم تُحذف تلقائيًا خلال 24 ساعة.</p>
                  </div>
  
                  <div>
                    <h3 className="font-bold text-zinc-800 dark:text-zinc-200">8. التعديلات على السياسة</h3>
                    <p>قد نقوم بتحديث سياسة الخصوصية من وقت لآخر. وفي حال وجود تغييرات جوهرية، سنحدّث تاريخ "آخر تحديث" في هذه الصفحة.</p>
                  </div>
  
                  <div>
                    <h3 className="font-bold text-zinc-800 dark:text-zinc-200">9. التواصل معنا</h3>
                    <p>إذا كانت لديك أي أسئلة حول سياسة الخصوصية أو ممارسات البيانات لدينا، يمكنك التواصل معنا عبر قناة الدعم الرسمية الموضحة في الموقع.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-zinc-50 dark:bg-zinc-950/50 rounded-sm mb-6" dir="ltr">
                <p className="text-xs text-zinc-500 dark:text-zinc-500 mb-4">Last updated: June 26, 2026</p>
                <p className="mb-4">This Privacy Policy explains how TestPilot handles information when you use our website and services.</p>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-zinc-800 dark:text-zinc-200">1. Information We Collect</h3>
                    <p>We collect only the information necessary to operate and improve the service. This may include transient scan data, technical request data, and temporary processing information needed to complete a scan. We do not maintain long-term server-side profiles of users or store user projects permanently on our servers.</p>
                  </div>
  
                  <div>
                    <h3 className="font-bold text-zinc-800 dark:text-zinc-200">2. How We Use Information</h3>
                    <p>We use temporary processing data only to analyze submitted content, generate reports, display results, and maintain operational continuity. We do not use retained data for marketing, profiling, advertising, or model training.</p>
                  </div>
  
                  <div>
                    <h3 className="font-bold text-zinc-800 dark:text-zinc-200">3. Data Retention</h3>
                    <p>Any data stored on our servers is retained only for the minimum period necessary to process the request and support service continuity. All server-side data is automatically deleted within 24 hours at the latest. We do not keep long-term server-side copies of user projects, scan results, or reports.</p>
                  </div>
  
                  <div>
                    <h3 className="font-bold text-zinc-800 dark:text-zinc-200">4. Local Device Storage</h3>
                    <p>If you choose to save history or preferences, those items remain on your device and are not stored on our servers. Local storage is controlled by your browser or device and can be removed by you at any time.</p>
                  </div>
  
                  <div>
                    <h3 className="font-bold text-zinc-800 dark:text-zinc-200">5. Sharing and Disclosure</h3>
                    <p>We do not sell personal data. We do not share user projects or scan results with third parties except where necessary to operate the service or comply with legal obligations.</p>
                  </div>
  
                  <div>
                    <h3 className="font-bold text-zinc-800 dark:text-zinc-200">6. Security</h3>
                    <p>We apply reasonable technical and organizational measures to protect transient server-side data during processing. However, no method of transmission or storage is completely secure, and we cannot guarantee absolute security.</p>
                  </div>
  
                  <div>
                    <h3 className="font-bold text-zinc-800 dark:text-zinc-200">7. Your Rights</h3>
                    <p>Depending on your jurisdiction, you may have rights to access, correct, or delete personal data. Since our server-side retention is temporary, most server-side information is automatically removed within 24 hours.</p>
                  </div>
  
                  <div>
                    <h3 className="font-bold text-zinc-800 dark:text-zinc-200">8. Changes to This Policy</h3>
                    <p>We may update this Privacy Policy from time to time. If we make material changes, we will update the "Last updated" date on this page.</p>
                  </div>
  
                  <div>
                    <h3 className="font-bold text-zinc-800 dark:text-zinc-200">9. Contact Us</h3>
                    <p>If you have questions about this Privacy Policy or our data practices, contact us through the official support channel listed on the website.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="tech-panel p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-sm">
              <FileText className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">{isAr ? 'شروط الاستخدام' : 'Terms of Use'}</h2>
          </div>
          <div className="space-y-4 text-zinc-600 leading-relaxed text-sm">
            {isAr ? (
              <>
                <p>
                  <strong>1. طبيعة الخدمة:</strong> توفر منصة TestPilot أدوات تحليل أداء المواقع كما هي في مرحلتها الحالية. النتائج مقدمة للاسترشاد ولا نتحمل مسؤولية أي قرارات تُتخذ بناءً عليها.
                </p>
                <p>
                  <strong>2. الاستخدام العادل:</strong> يرجى استخدام الأداة لفحص مشاريعك الخاصة أو المشاريع التي تملك صلاحية تحليلها. قد يؤدي الاستخدام المفرط أو المسيء للأداة إلى تقييد الوصول.
                </p>
                <p>
                  <strong>3. التعديلات:</strong> نحتفظ بالحق في تعديل هذه الشروط أو إيقاف الخدمة في أي وقت مع إشعار المستخدمين بذلك.
                </p>
              </>
            ) : (
              <>
                <p>
                  <strong>1. Nature of Service:</strong> TestPilot provides code analysis tools "as is". Results are provided for guidance, and we are not liable for decisions made based on them.
                </p>
                <p>
                  <strong>2. Fair Use:</strong> Please use the tool to scan your own projects or projects you are authorized to analyze. Excessive or abusive use may result in restricted access.
                </p>
                <p>
                  <strong>3. Modifications:</strong> We reserve the right to modify these terms or suspend the service at any time, with notice to users.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

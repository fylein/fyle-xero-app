source /fyle-xero-app/setup.sh

if [[ $OSTYPE == darwin* ]]
then
  SED_EXTRA_ARGS='""';
fi

for f in /usr/share/nginx/html/*
do
    echo "Substituting Environment variables and other stuff in $f ...";
    sed -i $SED_EXTRA_ARGS "s?{{API_URL}}?${API_URL}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{APP_URL}}?${APP_URL}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{CALLBACK_URI}}?${CALLBACK_URI}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{FYLE_CLIENT_ID}}?${FYLE_CLIENT_ID}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{FYLE_URL}}?${FYLE_URL}?g" $f;
    sed -i $SED_EXTRA_ARGS "s?{{PRODUCTION}}?${PRODUCTION}?g" $f;
done

nginx -g "daemon off;"
<?php
namespace EasyTeachLMS;

class Rest_API {
    public function __construct( $init = false ) {
        if ( true === $init ) {
            add_action('init', array( $this, 'init'));
        }
    }
    public function init() {
        add_action( 'rest_api_init', function() {
            $post_content_raw_schema = array(
                'description' => 'Content for the object, as it exists in the database.',
                'type'        => 'string',
                'context'     => array( 'view' ),
            );
        
            register_rest_field(
                'topic',
                'content_raw',
                array(
                    'get_callback' => array($this, 'show_post_content_raw'),
                    'schema'       => $post_content_raw_schema,
                  )
            );
        });
    }  
    
    public function show_post_content_raw( $object, $field_name, $request ) {
        return get_post( $object['id'] )->post_content;
    }
}
new Rest_API(true);